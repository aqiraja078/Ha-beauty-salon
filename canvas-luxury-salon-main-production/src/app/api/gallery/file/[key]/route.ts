import { readGalleryMedia } from "@/lib/gallery-store";

export const runtime = "nodejs";

/** Public streaming endpoint for uploaded gallery files (supports Range for video seeking). */
export async function GET(
  request: Request,
  ctx: { params: Promise<{ key: string }> }
) {
  const { key } = await ctx.params;

  let range: { start: number; end?: number } | undefined;
  const header = request.headers.get("range");
  if (header) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
    if (m && (m[1] || m[2])) {
      range = { start: m[1] ? Number(m[1]) : 0, end: m[2] ? Number(m[2]) : undefined };
    }
  }

  const media = await readGalleryMedia(key, range);
  if (!media) return new Response("Not found", { status: 404 });

  const headers: Record<string, string> = {
    "Content-Type": media.mime,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  };

  if (media.range) {
    const { start, end } = media.range;
    headers["Content-Range"] = `bytes ${start}-${end}/${media.size}`;
    headers["Content-Length"] = String(end - start + 1);
    return new Response(media.body as BodyInit, { status: 206, headers });
  }
  headers["Content-Length"] = String(media.size);
  return new Response(media.body as BodyInit, { status: 200, headers });
}
