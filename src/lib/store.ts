import "server-only";
import { promises as fs } from "fs";
import path from "path";

export type YesNo = "" | "yes" | "no";

export type Guest = {
  id: string;
  name: string;
  nickname?: string;
  party: string; // guests sharing a party RSVP together; blank in the sheet = their own party
  attending: YesNo;
  nightBefore: YesNo;
  dietary: string;
  message: string;
  updatedAt: string;
  extraAnswers?: string;
};

export type ResponseUpdate = Pick<Guest, "id" | "attending" | "nightBefore" | "dietary" | "message" | "extraAnswers">;

/*
 * Two backends:
 *  - Google Sheet (via the Apps Script in /google) when GOOGLE_SCRIPT_URL is set. Used in production.
 *  - A local JSON file (data/guests.local.json, created by `npm run seed`) for development.
 */
const LOCAL_FILE = path.join(process.cwd(), "data", "guests.local.json");

function backend(): "google" | "local" {
  if (process.env.GOOGLE_SCRIPT_URL) return "google";
  if (process.env.NODE_ENV !== "production" || process.env.RSVP_STORE === "local") return "local";
  throw new Error("RSVP storage is not configured: set GOOGLE_SCRIPT_URL and GOOGLE_SCRIPT_SECRET.");
}

function clean(raw: Partial<Guest>): Guest {
  const yn = (v: unknown): YesNo => (v === "yes" || v === "no" ? v : "");
  const id = String(raw.id ?? "").trim();
  return {
    id,
    name: String(raw.name ?? "").trim(),
    nickname: String(raw.nickname ?? "").trim(),
    party: String(raw.party ?? "").trim() || id,
    attending: yn(raw.attending),
    nightBefore: yn(raw.nightBefore),
    dietary: String(raw.dietary ?? ""),
    message: String(raw.message ?? ""),
    updatedAt: String(raw.updatedAt ?? ""),
    extraAnswers: String(raw.extraAnswers ?? ""),
  };
}

async function callScript(action: string, payload: Record<string, unknown> = {}) {
  const res = await fetch(process.env.GOOGLE_SCRIPT_URL!, {
    method: "POST",
    // text/plain keeps Apps Script happy (no preflight, body arrives in e.postData.contents)
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ secret: process.env.GOOGLE_SCRIPT_SECRET, action, ...payload }),
    cache: "no-store",
    redirect: "follow",
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`Sheet ${action} failed: ${data.error ?? res.status}`);
  return data;
}

export async function listGuests(): Promise<Guest[]> {
  if (backend() === "google") {
    const data = await callScript("list");
    return (data.guests as Partial<Guest>[]).map(clean).filter((g) => g.id && g.name);
  }
  try {
    const raw = JSON.parse(await fs.readFile(LOCAL_FILE, "utf8")) as Partial<Guest>[];
    return raw.map(clean).filter((g) => g.id && g.name);
  } catch {
    throw new Error("No local guest list. Run `npm run seed` first.");
  }
}

export async function saveResponses(updates: ResponseUpdate[]): Promise<void> {
  if (backend() === "google") {
    await callScript(updates.some((update) => update.extraAnswers !== undefined) ? "saveWithQuestions" : "save", { updates });
    return;
  }
  const guests = await listGuests();
  const now = new Date().toISOString();
  for (const u of updates) {
    const g = guests.find((x) => x.id === u.id);
    if (g) Object.assign(g, u, { updatedAt: now });
  }
  await fs.writeFile(LOCAL_FILE, JSON.stringify(guests, null, 2));
}
