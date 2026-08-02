/** Hair length tiers used for coloring, treatment, and premium cards. */
export type HairLength = "short" | "medium" | "long";

export type HairLengthPrices = Record<HairLength, string>;

export const HAIR_LENGTH_LABELS: Record<HairLength, string> = {
  short: "Short",
  medium: "Medium",
  long: "Long",
};

/** Only these hair menu sections show the length selector. */
export const HAIR_LENGTH_SECTION_IDS = new Set([
  "hair-color",
  "hair-treatment",
  "advanced-premium",
]);

export function parseRupees(price: string): number {
  const n = Number(String(price).replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function formatRupees(amount: number): string {
  const n = Math.max(0, Math.round(amount));
  return `Rs. ${n.toLocaleString("en-IN")}`;
}

/** Medium = menu price; short ≈ 15% less; long ≈ 25% more (rounded to 100). */
export function deriveLengthPrices(basePrice: string): HairLengthPrices {
  const medium = parseRupees(basePrice);
  if (!medium) {
    return {
      short: basePrice,
      medium: basePrice,
      long: basePrice,
    };
  }
  const round100 = (v: number) => Math.max(100, Math.round(v / 100) * 100);
  return {
    short: formatRupees(round100(medium * 0.85)),
    medium: formatRupees(medium),
    long: formatRupees(round100(medium * 1.25)),
  };
}
