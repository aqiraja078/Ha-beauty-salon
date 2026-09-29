export type GalleryMediaType = "image" | "video";
export type GallerySource = "upload" | "url";

export type GalleryItem = {
  id: string;
  type: GalleryMediaType;
  /** Public URL: an external link, or /api/gallery/file/<key> for uploaded files. */
  src: string;
  source: GallerySource;
  /** Storage key of an uploaded file (source = "upload"). */
  fileKey?: string;
  mime?: string;
  /** Optional cover image for videos. */
  poster?: string;
  title: string;
  caption: string;
  category: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type GalleryUrlInput = {
  src: string;
  type?: GalleryMediaType | "auto";
  poster?: string;
  title?: string;
  caption?: string;
  category?: string;
  published?: boolean;
};

export type GalleryPatch = Partial<
  Pick<GalleryItem, "title" | "caption" | "category" | "published" | "poster" | "src">
>;

export const GALLERY_IMAGE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

export const GALLERY_VIDEO_MIME = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/ogg",
] as const;

/** mime → file extension used for stored uploads. */
export const GALLERY_MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/ogg": "ogv",
};

export const GALLERY_EXT_MIME: Record<string, string> = Object.fromEntries(
  Object.entries(GALLERY_MIME_EXT).map(([m, e]) => [e, m])
);

export const GALLERY_FILE_KEY_RE = /^[a-f0-9-]{36}\.(jpg|png|webp|gif|avif|mp4|webm|mov|ogv)$/;

export type VideoEmbed =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string }
  | { kind: "file" };

/** Recognise YouTube / Vimeo links; anything else is treated as a direct video file. */
export function parseVideoEmbed(src: string): VideoEmbed {
  try {
    const u = new URL(src);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      if (id) return { kind: "youtube", id };
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = u.searchParams.get("v");
      if (v) return { kind: "youtube", id: v };
      const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{6,})/);
      if (m) return { kind: "youtube", id: m[1] };
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const m = u.pathname.match(/(\d{5,})/);
      if (m) return { kind: "vimeo", id: m[1] };
    }
  } catch {
    /* relative URL → file */
  }
  return { kind: "file" };
}

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m4v|ogv|ogg)(\?|#|$)/i;

export function guessMediaType(src: string): GalleryMediaType {
  if (parseVideoEmbed(src).kind !== "file") return "video";
  return VIDEO_EXT_RE.test(src) ? "video" : "image";
}
