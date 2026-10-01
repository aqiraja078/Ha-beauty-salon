import { randomUUID } from "crypto";
import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";

/**
 * Photos uploaded from the admin panel (hero, cards, blog/course covers, logo, …).
 * Live (Netlify): stored in Netlify Blobs store "site-media". Local: data/uploads/media.
 */
const MEDIA_STORE = "site-media";
const MEDIA_DIR = path.resolve(process.cwd(), "data", "uploads", "media");

export const MEDIA_MAX_BYTES = 5 * 1024 * 1024;

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};
const EXT_MIME: Record<string, string> = Object.fromEntries(
  Object.entries(MIME_EXT).map(([m, e]) => [e, m])
);
const KEY_RE = /^[a-f0-9-]{36}\.(jpg|png|webp|gif|avif)$/;

export const MEDIA_URL_PREFIX = "/api/media/";

async function blobs() {
  try {
    return await getStore(MEDIA_STORE);
  } catch {
    return null;
  }
}

/** Real file type from the first bytes (never trust the browser-sent type alone). */
export function sniffImageMime(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return "image/png";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP")
    return "image/webp";
  if (buf.subarray(0, 3).toString("ascii") === "GIF") return "image/gif";
  if (buf.subarray(4, 8).toString("ascii") === "ftyp") {
    const brand = buf.subarray(8, 12).toString("ascii");
    if (brand === "avif" || brand === "avis") return "image/avif";
  }
  return null;
}

export async function saveMediaImage(buffer: Buffer): Promise<{ url: string; key: string }> {
  if (buffer.byteLength > MEDIA_MAX_BYTES) {
    throw new Error("Photo is too large (max 5 MB).");
  }
  const mime = sniffImageMime(buffer);
  if (!mime) throw new Error("Only JPG, PNG, WebP, GIF or AVIF photos are allowed.");
  const key = `${randomUUID()}.${MIME_EXT[mime]}`;

  const store = await blobs();
  let saved = false;
  if (store) {
    try {
      const ab = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      ) as ArrayBuffer;
      await store.set(key, ab);
      saved = true;
    } catch (err) {
      console.error("[media] blob write failed, using local file:", err);
    }
  }
  if (!saved) {
    await fs.mkdir(MEDIA_DIR, { recursive: true });
    await fs.writeFile(path.join(MEDIA_DIR, key), buffer);
  }
  return { url: `${MEDIA_URL_PREFIX}${key}`, key };
}

export async function readMediaImage(
  key: string
): Promise<{ body: Uint8Array; mime: string } | null> {
  if (!KEY_RE.test(key)) return null;
  const mime = EXT_MIME[key.split(".").pop() ?? ""] ?? "application/octet-stream";
  try {
    return { body: new Uint8Array(await fs.readFile(path.join(MEDIA_DIR, key))), mime };
  } catch {
    /* not on disk → try blobs */
  }
  const store = await blobs();
  if (!store) return null;
  try {
    const ab = await store.get(key, { type: "arrayBuffer" });
    return ab ? { body: new Uint8Array(ab), mime } : null;
  } catch {
    return null;
  }
}
