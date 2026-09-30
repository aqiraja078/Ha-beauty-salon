/**
 * Content saved before the rebrand (e.g. in Netlify Blobs on the live site) can still
 * say "Huma Beauty Salon". Rewrite those legacy names to the current brand whenever
 * stored content is read, so every page, meta tag, and email shows the new name.
 * Only string values are touched; emails, URLs, and handles are lowercase and unaffected.
 */
const BRAND_NAME = "Adaa Beauty Salon & Training Center";
const LEGACY_FULL_NAME =
  /\b(?:huma|ha)\s+(?:beauty\s+)?(?:salon|saloon)(?:\s*(?:&amp;|&|and)\s*studio)?\b/gi;
const LEGACY_SHORT_NAME = /\b(?:Huma|HUMA)\b/g;

/** Image URLs that used to be seeded but no longer exist (404). */
const DEAD_IMAGE_FIXES: Array<[string, string]> = [
  ["photo-1516975080664-ed2fc6a86108", "photo-1516975080664-ed2fc6a32937"],
];

const OLD_EMAIL = /humabeautysalon07@gmail\.com/gi;
const NEW_EMAIL = "adaabeautysalonjhelum@gmail.com";

export function rebrandString(text: string): string {
  if (OLD_EMAIL.test(text)) {
    OLD_EMAIL.lastIndex = 0;
    text = text.replace(OLD_EMAIL, NEW_EMAIL);
  }
  for (const [dead, alive] of DEAD_IMAGE_FIXES) {
    if (text.includes(dead)) return text.split(dead).join(alive);
  }
  if (!text || !/huma/i.test(text) && !/\bha\s+(beauty\s+)?sal/i.test(text)) return text;
  if (/^(?:https?:|mailto:|tel:|\/)/i.test(text.trim())) return text;
  return text
    .replace(LEGACY_FULL_NAME, BRAND_NAME)
    .replace(LEGACY_SHORT_NAME, "Adaa");
}

export function rebrandLegacy<T>(value: T): T {
  if (typeof value === "string") return rebrandString(value) as T;
  if (Array.isArray(value)) return value.map((v) => rebrandLegacy(v)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = rebrandLegacy(v);
    }
    return out as T;
  }
  return value;
}
