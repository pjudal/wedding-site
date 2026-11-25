import { ALLOWED_TYPES, MAX_THUMB_BYTES, MAX_UPLOAD_BYTES, cleanName, createUpload, isGuestKey } from "@/lib/photos";

// Step 1 of an upload: the phone asks for signed URLs (photo + optional small preview), then PUTs straight to storage.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!isGuestKey(body?.k)) return Response.json({ error: "This link isn't valid. Scan the QR code again." }, { status: 403 });

  const type = String(body?.type ?? "");
  const size = Number(body?.size);
  if (!ALLOWED_TYPES[type]) return Response.json({ error: "Only photos (JPEG, PNG or WebP) can be shared." }, { status: 400 });
  if (!Number.isInteger(size) || size <= 0 || size > MAX_UPLOAD_BYTES) {
    return Response.json({ error: "That photo is too large." }, { status: 400 });
  }
  const thumbSize = Number(body?.thumbSize);
  const thumbOk = Number.isInteger(thumbSize) && thumbSize > 0 && thumbSize <= MAX_THUMB_BYTES;

  try {
    return Response.json(await createUpload(type, size, cleanName(body?.name), thumbOk ? thumbSize : undefined));
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Upload isn't available right now. Please try again." }, { status: 500 });
  }
}
