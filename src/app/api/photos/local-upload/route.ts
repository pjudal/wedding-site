import { MAX_UPLOAD_BYTES, isLocal, isUploadKey, saveLocalUpload } from "@/lib/photos";

// Development only: stands in for the signed R2 upload URL.
export async function PUT(request: Request) {
  if (!isLocal()) return new Response("Not found", { status: 404 });
  const key = new URL(request.url).searchParams.get("key");
  if (!isUploadKey(key)) return new Response("Bad key", { status: 400 });
  const body = await request.arrayBuffer();
  if (body.byteLength === 0 || body.byteLength > MAX_UPLOAD_BYTES) return new Response("Bad size", { status: 400 });
  await saveLocalUpload(key, body);
  return new Response(null, { status: 200 });
}
