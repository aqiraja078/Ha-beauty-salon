import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { saveGalleryUpload } from "@/lib/gallery-store";
import { GALLERY_MIME_EXT, type GalleryItem } from "@/lib/gallery-types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_MB = Number(process.env.GALLERY_MAX_UPLOAD_MB) || 100;

/** Upload one or more image / video files (multipart field "files"). */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Upload failed — file too large or connection dropped." },
      { status: 400 }
    );
  }

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "Choose at least one file." }, { status: 400 });
  }

  const category = String(form.get("category") ?? "");
  const title = String(form.get("title") ?? "");
  const published = form.get("published") !== "false";

  const items: GalleryItem[] = [];
  const errors: string[] = [];

  for (const file of files) {
    if (!GALLERY_MIME_EXT[file.type]) {
      errors.push(`${file.name}: unsupported type (${file.type || "unknown"}).`);
      continue;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      errors.push(`${file.name}: larger than ${MAX_MB} MB.`);
      continue;
    }
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      items.push(
        await saveGalleryUpload({
          buffer,
          mime: file.type,
          // A single file may carry a custom title; for several files leave it blank.
          title: files.length === 1 ? title : "",
          category,
          published,
        })
      );
    } catch (e) {
      errors.push(`${file.name}: ${e instanceof Error ? e.message : "could not save"}.`);
    }
  }

  if (items.length) revalidatePath("/gallery");
  return NextResponse.json(
    { items, errors },
    { status: items.length ? 201 : 400 }
  );
}
