import { guestKey, isAdminKey } from "@/lib/photos";

// Admin only: the links that go on the printed QR cards and the projector laptop.
export async function GET(request: Request) {
  const url = new URL(request.url);
  if (!isAdminKey(url.searchParams.get("k"))) return Response.json({ error: "forbidden" }, { status: 403 });
  const key = guestKey();
  if (!key) return Response.json({ error: "PHOTO_KEY is not set" }, { status: 500 });
  const origin = process.env.PUBLIC_SITE_URL?.replace(/\/$/, "") || url.origin;
  return Response.json({
    shareUrl: `${origin}/share?k=${encodeURIComponent(key)}`,
    liveUrl: `${origin}/live?k=${encodeURIComponent(key)}`,
  });
}
