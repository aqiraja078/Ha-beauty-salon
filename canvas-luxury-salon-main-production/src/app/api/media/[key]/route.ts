import { readMediaImage } from "@/lib/media-store";

export const runtime = "nodejs";

/** Public endpoint that serves photos uploaded from the admin panel. */
export async function GET(
  _request: Request,
  ctx: { params: Promise<{ key: string }> }
) {
  const { key } = await ctx.params;
  const media = await readMediaImage(key);
  if (!media) return new Response("Not found", { status: 404 });
  return new Response(media.body as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": media.mime,
      "Content-Length": String(media.body.byteLength),
      // File names are random and never reused, so they can be cached for a long time.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
