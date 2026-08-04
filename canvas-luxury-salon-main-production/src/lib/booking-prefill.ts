/** Resolve a booking ?service= query against known menu names. */
export function resolveBookingService(
  requested: string | undefined,
  options: string[]
): string | undefined {
  const raw = (requested ?? "").trim();
  if (!raw) return undefined;

  const exact = options.find((s) => s === raw);
  if (exact) return exact;

  const lower = raw.toLowerCase();
  const ci = options.find((s) => s.toLowerCase() === lower);
  if (ci) return ci;

  // Hair length labels: "Color (Medium)" — keep full string for the form
  const withoutLength = raw.replace(/\s*\((short|medium|long)\)\s*$/i, "").trim();
  if (withoutLength && withoutLength !== raw) {
    const base = options.find(
      (s) => s.toLowerCase() === withoutLength.toLowerCase()
    );
    if (base) return raw;
  }

  const starts = options.find((s) => s.toLowerCase().startsWith(lower));
  if (starts) return starts;

  const includes = options.find((s) => s.toLowerCase().includes(lower));
  if (includes) return includes;

  return raw;
}

export function bookingUrl(
  service?: string,
  price?: string,
  extra?: { mode?: "bridal" | "single" }
): string {
  const params = new URLSearchParams();
  if (service?.trim()) params.set("service", service.trim());
  if (price?.trim()) params.set("price", price.trim());
  if (extra?.mode === "bridal") params.set("mode", "bridal");
  const q = params.toString();
  return q ? `/book?${q}` : "/book";
}

export function safeSearchParam(value?: string | null): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  try {
    return decodeURIComponent(trimmed.replace(/\+/g, " ")).trim();
  } catch {
    return trimmed;
  }
}
