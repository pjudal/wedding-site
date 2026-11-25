import { findPhoto, isAdminKey, isGuestKey, isPhotoId, photoSource } from "@/lib/photos";

/*
 * Stable image URL for the pages: /api/photos/img?id=...[&k=...][&size=thumb][&download=1]
 * Redirects to a short-lived signed storage URL.
 *   size=thumb  small preview (falls back to the full photo for older uploads without one)
 *   download=1  browser saves the file instead of showing it
 *   admin=1     (photo admin) also serves hidden photos
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const k = params.get("k");
  const id = params.get("id");
  const admin = params.get("admin") === "1" && isAdminKey(k);
  if (!admin && !isGuestKey(k)) return new Response("Forbidden", { status: 403 });
  if (!isPhotoId(id)) return new Response("Not found", { status: 404 });

  const photo = await findPhoto(id);
  if (!photo || (photo.hidden && !admin)) return new Response("Not found", { status: 404 });

  const src = await photoSource(photo, { thumb: params.get("size") === "thumb", download: params.get("download") === "1" });
  if ("redirect" in src) {
    // Signed URL lives 1 hour; let the browser reuse the redirect for 50 minutes.
    return new Response(null, { status: 302, headers: { Location: src.redirect, "Cache-Control": "private, max-age=3000" } });
  }
  const headers: Record<string, string> = { "Content-Type": src.type, "Cache-Control": "private, max-age=3000" };
  if (src.disposition) headers["Content-Disposition"] = src.disposition;
  return new Response(new Uint8Array(src.file), { headers });
}
