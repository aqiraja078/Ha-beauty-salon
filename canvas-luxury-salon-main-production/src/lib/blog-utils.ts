/** Estimate reading time from plain / markdown-ish body text. */
export function blogReadingMinutes(body: string): number {
  const words = body
    .replace(/[#*_`>-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

export function formatBlogDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function normalizeBlogTags(raw: string[] | string | undefined): string[] {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : raw.split(/[,#]+/);
  const out: string[] = [];
  for (const t of list) {
    const clean = t.trim().replace(/^#/, "").slice(0, 40);
    if (clean && !out.includes(clean)) out.push(clean);
    if (out.length >= 12) break;
  }
  return out;
}
