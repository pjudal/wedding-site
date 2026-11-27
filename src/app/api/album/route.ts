import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { isAlbumDraftKey, readAlbumObject, readOnlineAlbumDraft, saveOnlineAlbumDraft, writeAlbumObject } from "@/lib/photos";

const photoId = /^[a-f0-9-]{36}\.jpg$/;
const layouts = new Set(["cover", "horizontal", "single", "pair", "trio", "four", "six"]);

function validManifest(pages: unknown, draft = false): boolean {
  return Array.isArray(pages) && pages.length > 0 && pages.length <= 200 && pages.every((page) =>
    page && layouts.has(page.layout) && Array.isArray(page.photos) && page.photos.length <= 6 &&
    (page.id === undefined || typeof page.id === "string" && /^[A-Za-z0-9_-]{1,40}$/.test(page.id)) &&
    [page.title, page.caption].every((value) => value === undefined || typeof value === "string" && value.length <= 70) &&
    page.photos.every((photo: { src: string; name: string; zoom?: number; x?: number; y?: number; caption?: string; showCaption?: boolean; captionSize?: number; captionBackground?: boolean; captionColor?: string } | null) =>
      photo === null || (photo && typeof photo.src === "string" &&
      (draft && /^draft:[a-f0-9-]{36}\.jpg$/.test(photo.src) ||
      photo.src.startsWith("/api/album?photo=") && photoId.test(photo.src.slice("/api/album?photo=".length))) &&
      typeof photo.name === "string" && photo.name.length <= 255 &&
      (photo.zoom === undefined || Number.isFinite(photo.zoom) && photo.zoom >= 0.5 && photo.zoom <= 3) &&
      (photo.caption === undefined || typeof photo.caption === "string" && photo.caption.length <= 80) &&
      (photo.showCaption === undefined || typeof photo.showCaption === "boolean") &&
      (photo.captionSize === undefined || Number.isInteger(photo.captionSize) && photo.captionSize >= 60 && photo.captionSize <= 160) &&
      (photo.captionBackground === undefined || typeof photo.captionBackground === "boolean") &&
      (photo.captionColor === undefined || typeof photo.captionColor === "string" && /^#[0-9a-f]{6}$/i.test(photo.captionColor)) &&
      [photo.x, photo.y].every((offset) => offset === undefined || Number.isFinite(offset) && Math.abs(offset) <= 100))),
  );
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  if (params.has("draft")) {
    if (!isAlbumDraftKey(request.headers.get("x-album-admin"))) return new Response(null, { status: 403 });
    const headers = { "Cache-Control": "private, no-store" };
    try {
      const id = params.get("draft");
      if (!id) return Response.json(await readOnlineAlbumDraft(), { headers });
      if (!photoId.test(id)) return new Response(null, { status: 404, headers });
      const photo = await readAlbumObject(`draft-${id}`);
      return photo
        ? new Response(photo.body, { headers: { ...headers, "Content-Type": "image/jpeg", "X-Content-Type-Options": "nosniff" } })
        : new Response(null, { status: 404, headers });
    } catch {
      return Response.json({ error: "Online draft storage is unavailable." }, { status: 503, headers });
    }
  }
  const id = params.get("photo");
  const size = Number(params.get("size"));
  const optimized = id !== null && [640, 960, 1440].includes(size);
  if (id !== null && !photoId.test(id)) return new Response(null, { status: 404 });
  try {
    const object = await readAlbumObject(id ?? "published.json");
    if (!object) return id ? new Response(null, { status: 404 }) : Response.json(null, { headers: { "Cache-Control": "no-store" } });
    const body = optimized
      ? new Uint8Array(await sharp(Buffer.from(await object.arrayBuffer()))
          .resize({ width: size, height: size, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 80 }).toBuffer())
      : object.body;
    return new Response(body, {
      headers: {
        "Content-Type": optimized ? "image/webp" : id ? "image/jpeg" : "application/json",
        "Cache-Control": id ? "public, max-age=31536000, immutable" : "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return Response.json({ error: "Album storage is unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!request.headers.has("x-album-admin")) {
    return Response.json({ error: "Open Album Admin to make changes." }, { status: 403 });
  }
  const action = new URL(request.url).searchParams.get("action");
  if (action?.startsWith("draft") && !isAlbumDraftKey(request.headers.get("x-album-admin"))) {
    return Response.json({ error: "Enter the online draft access key." }, { status: 403 });
  }
  try {
    if (action === "photo" || action === "draft-photo") {
      const bytes = await request.arrayBuffer();
      const signature = new Uint8Array(bytes, 0, Math.min(3, bytes.byteLength));
      if (bytes.byteLength > 2_000_000 || signature[0] !== 255 || signature[1] !== 216 || signature[2] !== 255) {
        return Response.json({ error: "Choose a JPEG under 2 MB." }, { status: 400 });
      }
      const id = `${randomUUID()}.jpg`;
      if (action === "draft-photo") {
        await writeAlbumObject(`draft-${id}`, bytes, "image/jpeg");
        return Response.json({ src: `draft:${id}` });
      }
      await writeAlbumObject(id, bytes, "image/jpeg");
      return Response.json({ src: `/api/album?photo=${id}` });
    }
    if (action === "draft-save") {
      const bytes = await request.arrayBuffer();
      if (bytes.byteLength > 1_000_000) return Response.json({ error: "Album is too large." }, { status: 400 });
      const { pages, revision } = JSON.parse(new TextDecoder().decode(bytes));
      if (!validManifest(pages, true) || (revision !== null && !/^"[a-f0-9]{32,64}"$/i.test(revision))) {
        return Response.json({ error: "Invalid online draft." }, { status: 400 });
      }
      const saved = await saveOnlineAlbumDraft(new TextEncoder().encode(JSON.stringify(pages)).buffer, revision);
      return saved
        ? Response.json({ revision: saved })
        : Response.json({ error: "Another device saved a newer draft. Back up your edits before opening it." }, { status: 409 });
    }
    if (action === "publish") {
      const bytes = await request.arrayBuffer();
      if (bytes.byteLength > 1_000_000) return Response.json({ error: "Album is too large." }, { status: 400 });
      const pages = JSON.parse(new TextDecoder().decode(bytes));
      if (!validManifest(pages)) return Response.json({ error: "Invalid album." }, { status: 400 });
      await writeAlbumObject("published.json", bytes, "application/json");
      return Response.json({ ok: true });
    }
    return Response.json({ error: "Unknown album action." }, { status: 400 });
  } catch (error) {
    console.error("Album write failed", action, error);
    const message = action === "photo" ? "Couldn’t upload a photo." : "Couldn’t save the album layout.";
    return Response.json({ error: `${message} Your draft is still on this device.` }, { status: 503 });
  }
}
