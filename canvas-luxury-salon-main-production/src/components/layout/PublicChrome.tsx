"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** The staff console ships its own sidebar, so public header/footer/FAB stay off /admin. */
export function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/slip/")) return null;
  return <>{children}</>;
}
