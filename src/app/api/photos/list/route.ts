import { isAdminKey, isGuestKey, listPhotos } from "@/lib/photos";

// The slideshow polls this and only ever gets visible photos.
// The photo admin asks with ?admin=1 and (if PHOTO_ADMIN_KEY is set) the admin key, and also gets hidden ones.
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const k = params.get("k");
  const admin = params.get("admin") === "1" && isAdminKey(k);
  if (params.get("admin") === "1" && !admin) return Response.json({ error: "forbidden" }, { status: 403 });
  if (!admin && !isGuestKey(k)) return Response.json({ error: "forbidden" }, { status: 403 });

  try {
    const photos = (await listPhotos())
      .filter((p) => admin || !p.hidden)
      .map(({ id, name, ts, hidden }) => (admin ? { id, name, ts, hidden } : { id, name, ts }));
    return Response.json({ admin, photos }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "list failed" }, { status: 500 });
  }
}
