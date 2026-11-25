import { findPhoto, isAdminKey, isGuestKey, isPhotoId, photoSource } from "@/lib/photos";

// Stable image URL for the pages: /api/photos/img?id=...&k=...  -> redirects to a short-lived signed storage URL.
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const k = params.get("k");
  const id = params.get("id");
  const admin = isAdminKey(k);
  if (!admin && !isGuestKey(k)) return new Response("Forbidden", { status: 403 });
  if (!isPhotoId(id)) return new Response("Not found", { status: 404 });

  const photo = await findPhoto(id);
  if (!photo || (photo.hidden && !admin)) return new Response("Not found", { status: 404 });

  const src = await photoSource(photo);
  if ("redirect" in src) {
    // Signed URL lives 1 hour; let the browser reuse the redirect for 50 minutes.
    return new Response(null, { status: 302, headers: { Location: src.redirect, "Cache-Control": "private, max-age=3000" } });
  }
  return new Response(new Uint8Array(src.file), { headers: { "Content-Type": src.type, "Cache-Control": "private, max-age=3000" } });
}
