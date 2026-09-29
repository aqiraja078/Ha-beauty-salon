/** Built-in ADAA logo files shipped in /public. Anything else set in Admin → Setting is a custom logo. */
const BUILT_IN_LOGOS = new Set([
  "",
  "/logo-header@2x.png",
  "/logo-header.png",
  "/logo-header@4k.png",
  "/logo-text@2x.png",
  "/logo-text.png",
  "/logo-full.png",
  "/logo.svg",
  "/logo-horizontal.svg",
]);

export function isCustomLogo(path: string | undefined): boolean {
  return !!path && !BUILT_IN_LOGOS.has(path.trim());
}
