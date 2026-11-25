import "server-only";
import { AwsClient } from "aws4fetch";
import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";

/*
 * Guest photo uploads.
 *
 * Two backends, same idea as the RSVP store:
 *  - Cloudflare R2 (S3 compatible) when the R2_* env vars are set. Used in production.
 *    Phones upload straight to R2 with a short-lived signed URL, so big files never pass through Vercel.
 *  - A local folder (data/photos, git-ignored) for development.
 *
 * Object layout in the bucket:
 *   photos/<id>--<name>.<ext>   the photo. <id> = 13-digit ms timestamp + "-" + random, so keys sort by upload time.
 *                               <name> = uploader's name, base64url (may be empty).
 *   thumbs/<id>.jpg             small preview (made on the phone, ~480px) for the guest gallery and admin grid. Optional:
 *                               photos uploaded before 2026-11-25 have none, and the full photo is used instead.
 *   hidden/<id>                 empty marker: photo is hidden from the slideshow and gallery (set from the admin page).
 */

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
export const MAX_THUMB_BYTES = 1024 * 1024;
export const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type Photo = { id: string; name: string; ts: number; hidden: boolean; thumb: boolean; key: string };

const LOCAL_DIR = path.join(process.cwd(), "data", "photos");
const ID_RE = /^\d{13}-[a-z0-9]{8}$/;
const KEY_RE = /^photos\/(\d{13}-[a-z0-9]{8})--([A-Za-z0-9_-]*)\.(jpg|png|webp)$/;
const THUMB_RE = /^thumbs\/(\d{13}-[a-z0-9]{8})\.jpg$/;
const thumbKey = (id: string) => `thumbs/${id}.jpg`;

function backend(): "r2" | "local" {
  if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET) {
    return "r2";
  }
  if (process.env.NODE_ENV !== "production") return "local";
  throw new Error("Photo storage is not configured: set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET.");
}

export function isLocal() {
  return backend() === "local";
}

// ---- access keys ---------------------------------------------------------------------------

// Optional passwords, set as env vars:
//   PHOTO_KEY        guest password, goes inside the QR code as ?k= (upload + slideshow)
//   PHOTO_ADMIN_KEY  PJ and Jedah only (photo admin: hide photos, print cards)
// Not set = that part is open to anyone with the link. Decide before printing the QR cards:
// the printed link only works with whatever PHOTO_KEY was when it was printed.
function configuredKey(kind: "guest" | "admin"): string {
  return (kind === "guest" ? process.env.PHOTO_KEY : process.env.PHOTO_ADMIN_KEY) ?? "";
}

function same(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function isAdminKey(k: unknown): boolean {
  const admin = configuredKey("admin");
  if (!admin) return true;
  return typeof k === "string" && same(k, admin);
}

export function isGuestKey(k: unknown): boolean {
  const guest = configuredKey("guest");
  if (!guest) return true;
  return typeof k === "string" && (same(k, guest) || (!!configuredKey("admin") && isAdminKey(k)));
}

export function guestKey() {
  return configuredKey("guest");
}

// ---- names and ids -------------------------------------------------------------------------

export function cleanName(raw: unknown): string {
  return String(raw ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
}

function newId() {
  const rand = randomBytes(8).toString("base64url").toLowerCase().replace(/[^a-z0-9]/g, "0").slice(0, 8);
  return `${Date.now()}-${rand}`;
}

export function isPhotoId(id: unknown): id is string {
  return typeof id === "string" && ID_RE.test(id);
}

function parseKey(key: string): Omit<Photo, "hidden" | "thumb"> | null {
  const m = KEY_RE.exec(key);
  if (!m) return null;
  let name = "";
  try {
    name = Buffer.from(m[2], "base64url").toString("utf8");
  } catch {}
  return { id: m[1], name, ts: Number(m[1].slice(0, 13)), key };
}

// ---- R2 -------------------------------------------------------------------------------------

let client: AwsClient | null = null;
function r2() {
  client ??= new AwsClient({
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    service: "s3",
    region: "auto",
  });
  return client;
}

function objectUrl(key = "") {
  const base = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET}`;
  return key ? `${base}/${key.split("/").map(encodeURIComponent).join("/")}` : base;
}

async function r2ListAll(): Promise<string[]> {
  const keys: string[] = [];
  let token = "";
  for (let page = 0; page < 50; page++) {
    const url = new URL(objectUrl());
    url.searchParams.set("list-type", "2");
    url.searchParams.set("max-keys", "1000");
    if (token) url.searchParams.set("continuation-token", token);
    const res = await r2().fetch(url.toString(), { cache: "no-store" });
    const xml = await res.text();
    if (!res.ok) throw new Error(`R2 list failed: ${res.status} ${xml.slice(0, 200)}`);
    for (const m of xml.matchAll(/<Key>([^<]+)<\/Key>/g)) keys.push(m[1]);
    const next = /<NextContinuationToken>([^<]+)<\/NextContinuationToken>/.exec(xml);
    if (!/<IsTruncated>true<\/IsTruncated>/.test(xml) || !next) break;
    token = next[1].replace(/&amp;/g, "&");
  }
  return keys;
}

// ---- public API -----------------------------------------------------------------------------

/** Returns where the browser should PUT the file. Content-Type and Content-Length are part of the signature. */
async function signedPut(key: string, contentType: string, size: number) {
  if (backend() === "local") return `/api/photos/local-upload?key=${encodeURIComponent(key)}`;
  const url = new URL(objectUrl(key));
  url.searchParams.set("X-Amz-Expires", "900");
  const signed = await r2().sign(url.toString(), {
    method: "PUT",
    headers: { "content-type": contentType, "content-length": String(size) },
    aws: { signQuery: true, allHeaders: true },
  });
  return signed.url;
}

/** Where the browser should PUT the photo (and its small preview). Type and size are part of the signature. */
export async function createUpload(contentType: string, size: number, name: string, thumbSize?: number) {
  const ext = ALLOWED_TYPES[contentType];
  if (!ext) throw new Error("bad type");
  const id = newId();
  const key = `photos/${id}--${Buffer.from(name, "utf8").toString("base64url")}.${ext}`;
  return {
    id,
    uploadUrl: await signedPut(key, contentType, size),
    thumbUploadUrl: thumbSize ? await signedPut(thumbKey(id), "image/jpeg", thumbSize) : undefined,
  };
}

export function isUploadKey(key: unknown): key is string {
  return typeof key === "string" && (KEY_RE.test(key) || THUMB_RE.test(key));
}

export async function saveLocalUpload(key: string, body: ArrayBuffer) {
  const file = path.join(LOCAL_DIR, key);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, Buffer.from(body));
  listCache = null;
}

// The image route looks photos up by id; a short cache stops a gallery of 200 images from listing the bucket 200 times.
// Hide/delete clear it on this server; other servers catch up within LIST_TTL_MS.
const LIST_TTL_MS = 5_000;
let listCache: { at: number; photos: Promise<Photo[]> } | null = null;

/** All photos, oldest first. Hidden ones are included with hidden=true. */
export async function listPhotos(maxAgeMs = 0): Promise<Photo[]> {
  if (maxAgeMs && listCache && Date.now() - listCache.at < maxAgeMs) return listCache.photos;
  const photos = readPhotos();
  listCache = { at: Date.now(), photos };
  photos.catch(() => (listCache = null));
  return photos;
}

async function readPhotos(): Promise<Photo[]> {
  let keys: string[];
  if (backend() === "r2") {
    keys = await r2ListAll();
  } else {
    const read = async (dir: string) => {
      try {
        return (await fs.readdir(path.join(LOCAL_DIR, dir))).map((f) => `${dir}/${f}`);
      } catch {
        return [];
      }
    };
    keys = [...(await read("photos")), ...(await read("hidden")), ...(await read("thumbs"))];
  }
  const hidden = new Set(keys.filter((k) => k.startsWith("hidden/")).map((k) => k.slice(7)));
  const thumbs = new Set(keys.map((k) => THUMB_RE.exec(k)?.[1]).filter(Boolean));
  return keys
    .map(parseKey)
    .filter((p): p is Omit<Photo, "hidden" | "thumb"> => !!p)
    .map((p) => ({ ...p, hidden: hidden.has(p.id), thumb: thumbs.has(p.id) }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export async function findPhoto(id: string): Promise<Photo | undefined> {
  return (await listPhotos(LIST_TTL_MS)).find((p) => p.id === id);
}

/** File name guests get when they download a photo, e.g. "PJ-and-Jedah-2027-03-21-1705-tita-baby-ab12.jpg". */
export function downloadName(photo: Photo) {
  const d = new Date(photo.ts + 8 * 3600_000).toISOString(); // Philippine time
  const who = photo.name
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 30);
  const ext = photo.key.split(".").pop();
  return `PJ-and-Jedah-${d.slice(0, 10)}-${d.slice(11, 16).replace(":", "")}${who ? `-${who}` : ""}-${photo.id.slice(14, 18)}.${ext}`;
}

/**
 * A URL the browser can load the image from (signed, valid 1 hour), or the local file contents.
 * thumb: the small preview if there is one. download: makes the browser save it instead of showing it.
 */
export async function photoSource(
  photo: Photo,
  opts: { thumb?: boolean; download?: boolean } = {},
): Promise<{ redirect: string } | { file: Buffer; type: string; disposition?: string }> {
  const key = opts.thumb && photo.thumb ? thumbKey(photo.id) : photo.key;
  // No spaces or quotes: R2 rejects the signature if the query has a "+"-encoded space. The name is [A-Za-z0-9.-] only.
  const disposition = opts.download ? `attachment;filename=${downloadName(photo)}` : undefined;
  if (backend() === "r2") {
    const url = new URL(objectUrl(key));
    url.searchParams.set("X-Amz-Expires", "3600");
    if (disposition) url.searchParams.set("response-content-disposition", disposition);
    const signed = await r2().sign(url.toString(), { method: "GET", aws: { signQuery: true } });
    return { redirect: signed.url };
  }
  const ext = key.split(".").pop()!;
  const type = Object.keys(ALLOWED_TYPES).find((t) => ALLOWED_TYPES[t] === ext)!;
  return { file: await fs.readFile(path.join(LOCAL_DIR, key)), type, disposition };
}

/** Permanently removes a photo, its preview and its hidden marker. */
export async function deletePhoto(photo: Photo) {
  const keys = [photo.key, thumbKey(photo.id), `hidden/${photo.id}`];
  listCache = null;
  if (backend() === "r2") {
    for (const key of keys) {
      const res = await r2().fetch(objectUrl(key), { method: "DELETE" });
      if (!res.ok && res.status !== 404) throw new Error(`R2 delete failed: ${res.status}`);
    }
    return;
  }
  for (const key of keys) await fs.rm(path.join(LOCAL_DIR, key), { force: true });
}

export async function setHidden(id: string, hidden: boolean) {
  const key = `hidden/${id}`;
  listCache = null;
  if (backend() === "r2") {
    const res = await r2().fetch(objectUrl(key), hidden ? { method: "PUT", body: "" } : { method: "DELETE" });
    if (!res.ok && res.status !== 404) throw new Error(`R2 hide failed: ${res.status}`);
    return;
  }
  const file = path.join(LOCAL_DIR, key);
  if (hidden) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, "");
  } else {
    await fs.rm(file, { force: true });
  }
}

// The couple’s album is separate from guest uploads.
export async function readAlbumObject(key: string): Promise<Response | null> {
  if (backend() === "local") {
    try {
      return new Response(new Uint8Array(await fs.readFile(path.join(LOCAL_DIR, "album", key))));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }
  const response = await r2().fetch(objectUrl(`album/${key}`), { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Could not read album");
  return response;
}

export async function writeAlbumObject(key: string, body: ArrayBuffer, contentType: string) {
  if (backend() === "local") {
    const directory = path.join(LOCAL_DIR, "album");
    await fs.mkdir(directory, { recursive: true });
    const temporary = path.join(directory, randomBytes(16).toString("hex"));
    await fs.writeFile(temporary, Buffer.from(body));
    await fs.rename(temporary, path.join(directory, key));
    return;
  }
  const response = await r2().fetch(objectUrl(`album/${key}`), {
    method: "PUT", body, headers: { "Content-Type": contentType },
  });
  if (!response.ok) throw new Error("Could not save album");
}
