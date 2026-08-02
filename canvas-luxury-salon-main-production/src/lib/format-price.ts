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
