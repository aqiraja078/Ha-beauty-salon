/** Hosts allowed by next.config.ts images.remotePatterns. Other URLs are rendered unoptimized so admin-pasted links never break. */
const OPTIMIZED_HOSTS = new Set(["images.unsplash.com", "i.pinimg.com"]);

export function canOptimizeImage(src: string): boolean {
  if (!src) return true;
  // Admin uploads are already resized in the browser and served by our own API.
  if (src.startsWith("/api/")) return false;
  if (src.startsWith("/")) return true;
  try {
    return OPTIMIZED_HOSTS.has(new URL(src).hostname);
  } catch {
    return false;
  }
}
