import type { ReactNode } from "react";

export type ScopeId =
  | "home"
  | "hair"
  | "makeup"
  | "facial"
  | "body-spa"
  | "nails"
  | "mehndi"
  | "contact"
  | "book"
  | "admin";

/**
 * Applies a page-level palette scope. The CSS variables declared for each
 * scope in globals.css re-tint every token-based utility inside it.
 */
export function ThemeScope({
  scope,
  children,
  className = "",
}: {
  scope: ScopeId;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-scope={scope} className={`relative bg-canvas text-ink ${className}`}>
      {children}
    </div>
  );
}
