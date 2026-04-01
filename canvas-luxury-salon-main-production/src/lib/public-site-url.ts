/**
 * Canonical public origin for metadata, sitemap, robots, and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in production (https://your-domain.com, no trailing slash).
 */
const DEFAULT_ORIGIN = "https://humasalon.com.pk";

export function getPublicSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw).origin;
    } catch {
      // fall through
    }
  }
  return DEFAULT_ORIGIN;
}

/** Safe URL for Next.js `metadataBase` (always absolute). */
export function getMetadataBase(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw);
    } catch {
      // fall through
    }
  }
  try {
    return new URL(DEFAULT_ORIGIN);
  } catch {
    return new URL("https://example.com");
  }
}
