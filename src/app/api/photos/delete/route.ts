import { deletePhoto, findPhoto, isAdminKey, isPhotoId, listPhotos } from "@/lib/photos";

// Photo admin only: permanently delete a photo (the file, its preview and its hidden marker). Can't be undone.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!isAdminKey(body?.k)) return Response.json({ error: "forbidden" }, { status: 403 });
  if (!isPhotoId(body?.id)) return Response.json({ error: "bad id" }, { status: 400 });
  try {
    await listPhotos(); // fresh list, so a just-uploaded photo is found
    const photo = await findPhoto(body.id);
    if (!photo) return Response.json({ ok: true, alreadyGone: true });
    await deletePhoto(photo);
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "failed" }, { status: 500 });
  }
}
