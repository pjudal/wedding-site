import { isAdminKey, isGuestKey, listPhotos } from "@/lib/photos";

// The slideshow polls this. Guests get visible photos only; the admin key also gets hidden ones.
export async function GET(request: Request) {
  const k = new URL(request.url).searchParams.get("k");
  const admin = isAdminKey(k);
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
