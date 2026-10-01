import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { MEDIA_MAX_BYTES, saveMediaImage } from "@/lib/media-store";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Upload one photo (multipart field "file"). Returns { url } to store in any image field. */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Upload failed — photo too large or connection dropped." },
      { status: 400 }
    );
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a photo first." }, { status: 400 });
  }
  if (file.size > MEDIA_MAX_BYTES) {
    return NextResponse.json({ error: "Photo is too large (max 5 MB)." }, { status: 413 });
  }
  try {
    const { url } = await saveMediaImage(Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not save the photo." },
      { status: 400 }
    );
  }
}
