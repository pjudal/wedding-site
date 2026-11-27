import { timingSafeEqual, createHash } from "node:crypto";
import { readQuestions, writeQuestions } from "@/lib/rsvp-question-store";
import { validateQuestions } from "@/lib/rsvp-questions";

const headers = { "Cache-Control": "no-store" };
const digest = (value: string) => createHash("sha256").update(value).digest();

export async function GET() {
  try {
    return Response.json(await readQuestions(), { headers });
  } catch {
    return Response.json({ error: "Couldn’t load RSVP questions." }, { status: 503, headers });
  }
}

export async function PUT(request: Request) {
  const secret = process.env.RSVP_ADMIN_KEY;
  const supplied = request.headers.get("x-rsvp-admin");
  if (!secret || !supplied || !timingSafeEqual(digest(secret), digest(supplied))) {
    return Response.json({ error: "Enter your RSVP admin key." }, { status: 403, headers });
  }
  const raw = await request.text();
  try {
    const questions: unknown = raw.length <= 60_000 ? JSON.parse(raw) : null;
    if (!validateQuestions(questions)) throw new Error("Invalid questions");
    await writeQuestions(questions);
    return Response.json({ ok: true }, { headers });
  } catch (error) {
    if (error instanceof SyntaxError || (error instanceof Error && error.message === "Invalid questions")) {
      return Response.json({ error: "Check your question text, answer options, and reveal rules." }, { status: 400, headers });
    }
    return Response.json({ error: "Couldn’t publish questions." }, { status: 503, headers });
  }
}
