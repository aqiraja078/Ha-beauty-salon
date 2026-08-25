/** Shared slug helpers for blog / courses / jobs. */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function uniqueSlug(desired: string, existing: string[]): string {
  const base = slugify(desired) || "item";
  let candidate = base;
  let n = 2;
  const taken = new Set(
    existing.filter((s) => Boolean(s)).map((s) => s.toLowerCase())
  );
  while (taken.has(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}
