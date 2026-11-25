import { isAdminKey, isPhotoId, setHidden } from "@/lib/photos";

// Admin only: hide a photo from the slideshow (or bring it back). The file itself is kept.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!isAdminKey(body?.k)) return Response.json({ error: "forbidden" }, { status: 403 });
  if (!isPhotoId(body?.id)) return Response.json({ error: "bad id" }, { status: 400 });
  try {
    await setHidden(body.id, body.hidden === true);
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "failed" }, { status: 500 });
  }
}
