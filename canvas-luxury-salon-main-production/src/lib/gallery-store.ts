import { randomUUID } from "crypto";
import { getStore } from "@netlify/blobs";
import { createReadStream, promises as fs } from "fs";
import path from "path";
import { Readable } from "stream";
import { getHomeContent } from "@/lib/content-store";
import {
  GALLERY_EXT_MIME,
  GALLERY_FILE_KEY_RE,
  GALLERY_MIME_EXT,
  guessMediaType,
  type GalleryItem,
  type GalleryMediaType,
  type GalleryPatch,
  type GalleryUrlInput,
} from "@/lib/gallery-types";

const LIST_KEY = "salon-gallery";
const DATA_DIR = path.resolve(process.cwd(), "data");
const LIST_FILE = path.join(DATA_DIR, "gallery.json");
const MEDIA_DIR = path.join(DATA_DIR, "uploads", "gallery");
const MEDIA_STORE = "gallery-media";

async function getCmsBlobs() {
  try {
    return await getStore("cms");
  } catch {
    return null;
  }
}

async function getMediaBlobs() {
  try {
    return await getStore(MEDIA_STORE);
  } catch {
    return null;
  }
}

async function readLocalList(): Promise<GalleryItem[] | null> {
  try {
    const raw = await fs.readFile(LIST_FILE, "utf-8");
    const parsed = JSON.parse(raw) as GalleryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return null;
  }
}

async function writeLocalList(list: GalleryItem[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(LIST_FILE, JSON.stringify(list, null, 2), "utf-8");
}

function sorted(list: GalleryItem[]): GalleryItem[] {
  return [...list].sort(
    (a, b) =>
      a.sortOrder - b.sortOrder || b.createdAt.localeCompare(a.createdAt)
  );
}

/** Stored list, or null when the gallery has never been saved anywhere. */
async function loadStoredList(): Promise<GalleryItem[] | null> {
  const store = await getCmsBlobs();
  if (store) {
    try {
      const data = await store.get(LIST_KEY, { type: "json" });
      if (Array.isArray(data)) return data as GalleryItem[];
    } catch {
      /* fall through to local file */
    }
  }
  return readLocalList();
}

/**
 * First run only: the photos that used to live in the Home page gallery block
 * become the first gallery items, so nothing already on the site is lost.
 */
async function seedFromHome(): Promise<GalleryItem[]> {
  const home = await getHomeContent();
  const now = new Date().toISOString();
  const items: GalleryItem[] = home.gallery.images
    .filter((src) => isSafeUrl(src))
    .map((src, n) => ({
      id: randomUUID(),
      type: guessMediaType(src),
      src,
      source: "url" as const,
      title: "",
      caption: "",
      category: "Recent work",
      published: true,
      sortOrder: n,
      createdAt: now,
      updatedAt: now,
    }));
  await saveList(items);
  return items;
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const stored = await loadStoredList();
    if (stored) return sorted(stored);
    return sorted(await seedFromHome());
  } catch {
    return [];
  }
}

export async function getPublishedGalleryItems(): Promise<GalleryItem[]> {
  return (await getGalleryItems()).filter((i) => i.published);
}

async function saveList(list: GalleryItem[]) {
  const store = await getCmsBlobs();
  if (store) {
    try {
      await store.set(LIST_KEY, JSON.stringify(list));
      return;
    } catch (err) {
      console.error("[gallery] blob write failed, using local file:", err);
    }
  }
  await writeLocalList(list);
}

function clean(s: unknown, max: number): string {
  return typeof s === "string" ? s.trim().slice(0, max) : "";
}

function isSafeUrl(s: string): boolean {
  return /^https?:\/\//i.test(s) || /^\/(?!\/)/.test(s);
}

/** New items go to the top (lowest sortOrder). */
function nextTopOrder(list: GalleryItem[]): number {
  return list.length ? Math.min(...list.map((i) => i.sortOrder)) - 1 : 0;
}

export async function addGalleryUrlItem(
  input: GalleryUrlInput
): Promise<GalleryItem> {
  const src = clean(input.src, 1000);
  if (!src || !isSafeUrl(src)) {
    throw new Error("Enter a valid link starting with https://");
  }
  const type: GalleryMediaType =
    input.type === "image" || input.type === "video"
      ? input.type
      : guessMediaType(src);
  const poster = clean(input.poster, 1000);
  if (poster && !isSafeUrl(poster)) throw new Error("Cover image link is not valid.");
  const list = await getGalleryItems();
  const now = new Date().toISOString();
  const item: GalleryItem = {
    id: randomUUID(),
    type,
    src,
    source: "url",
    poster: poster || undefined,
    title: clean(input.title, 160),
    caption: clean(input.caption, 600),
    category: clean(input.category, 60),
    published: input.published !== false,
    sortOrder: nextTopOrder(list),
    createdAt: now,
    updatedAt: now,
  };
  await saveList([item, ...list]);
  return item;
}

export async function saveGalleryUpload(opts: {
  buffer: Buffer;
  mime: string;
  title?: string;
  caption?: string;
  category?: string;
  published?: boolean;
}): Promise<GalleryItem> {
  const ext = GALLERY_MIME_EXT[opts.mime];
  if (!ext) throw new Error("Unsupported file type.");
  const fileKey = `${randomUUID()}.${ext}`;

  const blobs = await getMediaBlobs();
  let stored = false;
  if (blobs) {
    try {
      const ab = opts.buffer.buffer.slice(
        opts.buffer.byteOffset,
        opts.buffer.byteOffset + opts.buffer.byteLength
      ) as ArrayBuffer;
      await blobs.set(fileKey, ab);
      stored = true;
    } catch (err) {
      console.error("[gallery] blob media write failed, using local file:", err);
    }
  }
  if (!stored) {
    await fs.mkdir(MEDIA_DIR, { recursive: true });
    await fs.writeFile(path.join(MEDIA_DIR, fileKey), opts.buffer);
  }

  const list = await getGalleryItems();
  const now = new Date().toISOString();
  const item: GalleryItem = {
    id: randomUUID(),
    type: opts.mime.startsWith("video/") ? "video" : "image",
    src: `/api/gallery/file/${fileKey}`,
    source: "upload",
    fileKey,
    mime: opts.mime,
    title: clean(opts.title, 160),
    caption: clean(opts.caption, 600),
    category: clean(opts.category, 60),
    published: opts.published !== false,
    sortOrder: nextTopOrder(list),
    createdAt: now,
    updatedAt: now,
  };
  await saveList([item, ...list]);
  return item;
}

export async function updateGalleryItem(
  id: string,
  patch: GalleryPatch
): Promise<GalleryItem | null> {
  const list = await getGalleryItems();
  const idx = list.findIndex((i) => i.id === id);
  if (idx < 0) return null;
  const cur = list[idx];
  const next: GalleryItem = { ...cur, updatedAt: new Date().toISOString() };
  if (patch.title !== undefined) next.title = clean(patch.title, 160);
  if (patch.caption !== undefined) next.caption = clean(patch.caption, 600);
  if (patch.category !== undefined) next.category = clean(patch.category, 60);
  if (patch.published !== undefined) next.published = Boolean(patch.published);
  if (patch.poster !== undefined) {
    const p = clean(patch.poster, 1000);
    if (p && !isSafeUrl(p)) throw new Error("Cover image link is not valid.");
    next.poster = p || undefined;
  }
  if (patch.src !== undefined && cur.source === "url") {
    const s = clean(patch.src, 1000);
    if (!s || !isSafeUrl(s)) throw new Error("Enter a valid link starting with https://");
    next.src = s;
  }
  list[idx] = next;
  await saveList(list);
  return next;
}

export async function reorderGallery(orderedIds: string[]): Promise<GalleryItem[]> {
  const list = await getGalleryItems();
  const pos = new Map(orderedIds.map((id, i) => [id, i]));
  const rest = list.filter((i) => !pos.has(i.id));
  const first = orderedIds
    .map((id) => list.find((i) => i.id === id))
    .filter((i): i is GalleryItem => Boolean(i));
  const merged = [...first, ...rest].map((i, n) => ({ ...i, sortOrder: n }));
  await saveList(merged);
  return merged;
}

async function deleteMediaFile(fileKey: string) {
  if (!GALLERY_FILE_KEY_RE.test(fileKey)) return;
  const blobs = await getMediaBlobs();
  if (blobs) {
    try {
      await blobs.delete(fileKey);
    } catch {
      /* ignore */
    }
  }
  try {
    await fs.unlink(path.join(MEDIA_DIR, fileKey));
  } catch {
    /* ignore */
  }
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  const list = await getGalleryItems();
  const item = list.find((i) => i.id === id);
  if (!item) return false;
  await saveList(list.filter((i) => i.id !== id));
  if (item.fileKey) await deleteMediaFile(item.fileKey);
  return true;
}

export type GalleryMediaStream = {
  body: ReadableStream<Uint8Array> | Uint8Array;
  mime: string;
  size: number;
  /** Byte range actually returned (inclusive) when a Range was requested. */
  range?: { start: number; end: number };
};

/** Read an uploaded file (optionally a byte range for video seeking). */
export async function readGalleryMedia(
  key: string,
  range?: { start: number; end?: number }
): Promise<GalleryMediaStream | null> {
  if (!GALLERY_FILE_KEY_RE.test(key)) return null;
  const ext = key.split(".").pop() ?? "";
  const mime = GALLERY_EXT_MIME[ext] ?? "application/octet-stream";

  const file = path.join(MEDIA_DIR, key);
  try {
    const st = await fs.stat(file);
    const size = st.size;
    if (range) {
      const start = Math.min(range.start, size - 1);
      const end = Math.min(range.end ?? size - 1, size - 1);
      const stream = createReadStream(file, { start, end });
      return {
        body: Readable.toWeb(stream) as unknown as ReadableStream<Uint8Array>,
        mime,
        size,
        range: { start, end },
      };
    }
    return {
      body: Readable.toWeb(createReadStream(file)) as unknown as ReadableStream<Uint8Array>,
      mime,
      size,
    };
  } catch {
    /* not on disk → try blobs */
  }

  const blobs = await getMediaBlobs();
  if (!blobs) return null;
  try {
    const ab = await blobs.get(key, { type: "arrayBuffer" });
    if (!ab) return null;
    const all = new Uint8Array(ab);
    const size = all.byteLength;
    if (range) {
      const start = Math.min(range.start, size - 1);
      const end = Math.min(range.end ?? size - 1, size - 1);
      return { body: all.slice(start, end + 1), mime, size, range: { start, end } };
    }
    return { body: all, mime, size };
  } catch {
    return null;
  }
}
