import { guestKey, isAdminKey } from "@/lib/photos";

// Admin only: the links that go on the printed QR cards and the projector laptop.
// With no PHOTO_KEY set, they are the plain /share and /live addresses.
export async function GET(request: Request) {
  const url = new URL(request.url);
  if (!isAdminKey(url.searchParams.get("k"))) return Response.json({ error: "forbidden" }, { status: 403 });
  const key = guestKey();
  const q = key ? `?k=${encodeURIComponent(key)}` : "";
  const origin = process.env.PUBLIC_SITE_URL?.replace(/\/$/, "") || url.origin;
  return Response.json({ shareUrl: `${origin}/share${q}`, liveUrl: `${origin}/live${q}`, galleryUrl: `${origin}/gallery${q}` });
}
