import { formatRupees } from "@/lib/hair-length-pricing";

export type ServiceDiscountType = "percent" | "amount";

export type ServiceDiscount = {
  type: ServiceDiscountType;
  value: number;
};

/** Build a usable discount from the loosely-typed CMS fields (or null when off / invalid). */
export function toServiceDiscount(
  type: unknown,
  value: unknown
): ServiceDiscount | null {
  if (type !== "percent" && type !== "amount") return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (type === "percent" && n >= 100) return null;
  return { type, value: Math.round(n * 100) / 100 };
}

/** The single rupee amount in a price like "Rs. 7,000" / "From Rs. 2,500", or null for ranges / text. */
function singleAmount(price: string): number | null {
  const groups = price.match(/\d[\d,]*/g);
  if (!groups || groups.length !== 1) return null;
  const n = Number(groups[0].replace(/,/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Apply a discount to a menu price. Keeps a leading "From " and returns null when the
 * price is not a single number (ranges, "Consult", etc.) or the discount would be >= price.
 */
export function discountedPrice(
  price: string,
  discount: ServiceDiscount | null | undefined
): string | null {
  if (!discount) return null;
  const base = singleAmount(price);
  if (base === null) return null;
  const off =
    discount.type === "percent"
      ? (base * discount.value) / 100
      : discount.value;
  const next = Math.round(base - off);
  if (next <= 0 || next >= base) return null;
  const prefix = /^\s*from\b/i.test(price) ? "From " : "";
  return `${prefix}${formatRupees(next)}`;
}

export function discountBadge(discount: ServiceDiscount): string {
  return discount.type === "percent"
    ? `${discount.value}% OFF`
    : `${formatRupees(discount.value)} OFF`;
}
