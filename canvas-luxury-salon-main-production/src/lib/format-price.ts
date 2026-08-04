/** Display menu prices consistently as a “from” line for guests and staff. */
export function formatFromPrice(raw: string | undefined | null): string {
  const price = (raw ?? "").trim();
  if (!price) return "Price on consult";
  if (/^(from|starting|quote|consult|complimentary|see\b)/i.test(price)) {
    return price;
  }
  if (/^rs\.?\s?/i.test(price) || /^pkr\b/i.test(price)) {
    return `From ${price}`;
  }
  return `From ${price}`;
}

/** Extract first numeric amount from a price string (e.g. "Rs. 6,000" → 6000). */
export function parsePriceAmount(raw: string | undefined | null): number | null {
  const price = (raw ?? "").trim();
  if (!price) return null;
  if (/consult|quote|see menu|on request/i.test(price) && !/\d/.test(price)) {
    return null;
  }
  const m = price.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

export function sumServicePrices(
  names: string[],
  priceMap: Record<string, string>
): { total: number | null; labeled: string } {
  let sum = 0;
  let counted = 0;
  for (const name of names) {
    const amount = parsePriceAmount(priceMap[name]);
    if (amount != null) {
      sum += amount;
      counted += 1;
    }
  }
  if (!counted) {
    return { total: null, labeled: "Price on consult" };
  }
  return {
    total: sum,
    labeled: `From Rs. ${sum.toLocaleString("en-PK")}`,
  };
}
