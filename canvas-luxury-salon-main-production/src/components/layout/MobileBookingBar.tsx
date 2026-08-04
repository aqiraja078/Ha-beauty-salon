"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteContent } from "@/lib/cms-types";
import { whatsappBookUrl } from "@/lib/site";

export function MobileBookingBar({ site }: { site?: SiteContent }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/book")) {
    return null;
  }

  const wa = whatsappBookUrl(
    undefined,
    site ? { name: site.name, phoneDigits: site.phoneDigits } : undefined
  );

  return (
    <>
      <div className="h-[4.25rem] md:hidden" aria-hidden />
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-3 pt-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
          <Link
            href="/book"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-fg transition hover:brightness-95"
          >
            Book now
          </Link>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#25D366] px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:brightness-95"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
