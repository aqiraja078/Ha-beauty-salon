import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  addGalleryUrlItem,
  deleteGalleryItem,
  getGalleryItems,
  reorderGallery,
  updateGalleryItem,
} from "@/lib/gallery-store";
import type { GalleryPatch, GalleryUrlInput } from "@/lib/gallery-types";

function refresh() {
  revalidatePath("/gallery");
}

async function json(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const b = await request.json();
    return b && typeof b === "object" ? (b as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  return NextResponse.json(await getGalleryItems());
}

/** Add an image / video by link. */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const b = await json(request);
  if (!b) return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  try {
    const item = await addGalleryUrlItem({
      src: typeof b.src === "string" ? b.src : "",
      type:
        b.type === "image" || b.type === "video" || b.type === "auto"
          ? b.type
          : "auto",
      poster: typeof b.poster === "string" ? b.poster : undefined,
      title: typeof b.title === "string" ? b.title : undefined,
      caption: typeof b.caption === "string" ? b.caption : undefined,
      category: typeof b.category === "string" ? b.category : undefined,
      published: typeof b.published === "boolean" ? b.published : undefined,
    } satisfies GalleryUrlInput);
    refresh();
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not save." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const b = await json(request);
  if (!b || typeof b.id !== "string") {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  const patch: GalleryPatch = {};
  for (const k of ["title", "caption", "category", "poster", "src"] as const) {
    if (typeof b[k] === "string") patch[k] = b[k] as string;
  }
  if (typeof b.published === "boolean") patch.published = b.published;
  try {
    const item = await updateGalleryItem(b.id, patch);
    if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
    refresh();
    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not save." },
      { status: 400 }
    );
  }
}

/** Reorder: { order: [id, id, …] } */
export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const b = await json(request);
  if (!b || !Array.isArray(b.order)) {
    return NextResponse.json({ error: "Missing order." }, { status: 400 });
  }
  const ids = b.order.filter((x): x is string => typeof x === "string");
  const list = await reorderGallery(ids);
  refresh();
  return NextResponse.json(list);
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const b = await json(request);
  if (!b || typeof b.id !== "string") {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  try {
    const ok = await deleteGalleryItem(b.id);
    if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not delete." },
      { status: 500 }
    );
  }
  refresh();
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
