type Bucket = { count: number; windowStart: number };

const store = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 10;

function prune(now: number): void {
  if (store.size < 2000) return;
  for (const [k, v] of store) {
    if (now - v.windowStart > WINDOW_MS) store.delete(k);
  }
}

/**
 * Simple fixed-window limiter (per key). In-memory only — use one Node process or
 * edge/redis for multi-instance production if needed.
 */
export function rateLimitBooking(key: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  prune(now);

  const b = store.get(key);
  if (!b || now - b.windowStart > WINDOW_MS) {
    store.set(key, { count: 1, windowStart: now });
    return { ok: true };
  }
  if (b.count >= MAX_REQUESTS) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((WINDOW_MS - (now - b.windowStart)) / 1000)
    );
    return { ok: false, retryAfterSec };
  }
  b.count += 1;
  return { ok: true };
}

export function clientIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 64);
  return "unknown";
}
