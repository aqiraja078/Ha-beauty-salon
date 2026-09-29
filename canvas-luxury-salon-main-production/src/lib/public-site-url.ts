/**
 * Canonical public origin for metadata, sitemap, robots, and JSON-LD.
 * Order: NEXT_PUBLIC_SITE_URL (set this to your custom domain) → Netlify's own `URL`
 * → the live Netlify address. No trailing slash.
 */
const DEFAULT_ORIGIN = "https://habeautysalon.netlify.app";

function fromEnv(): URL | null {
  for (const raw of [process.env.NEXT_PUBLIC_SITE_URL, process.env.URL]) {
    const value = raw?.trim();
    if (!value) continue;
    try {
      return new URL(value);
    } catch {
      // try the next candidate
    }
  }
  return null;
}

export function getPublicSiteOrigin(): string {
  return (fromEnv() ?? new URL(DEFAULT_ORIGIN)).origin;
}

/** Safe URL for Next.js `metadataBase` (always absolute). */
export function getMetadataBase(): URL {
  return fromEnv() ?? new URL(DEFAULT_ORIGIN);
}
