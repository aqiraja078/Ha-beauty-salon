"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type NavItem = {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
  Icon: (props: { className?: string; strokeWidth?: number }) => ReactNode;
  isServices?: boolean;
};

const SERVICES_MENU = [
  { href: "/services/makeup", label: "Makeup" },
  { href: "/services/hair", label: "Hair" },
  { href: "/services/facial", label: "Facial" },
  { href: "/services/body-spa", label: "Wax" },
  { href: "/services/mehndi", label: "Mehndi" },
  { href: "/services/nails", label: "Nail, mani & pedi" },
] as const;

function IconHome({
  className,
  strokeWidth = 1.6,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3.8 10.8 12 3.8l8.2 7V20a.9.9 0 0 1-.9.9h-5.1v-5.6H9.8V20.9H4.7a.9.9 0 0 1-.9-.9v-9.2Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBook({
  className,
  strokeWidth = 1.6,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="5"
        y="4.5"
        width="14"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path d="M5 9h14" stroke="currentColor" strokeWidth={strokeWidth} />
      <path
        d="M9 13.2 11 15.2 15.2 11"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconStar({
  className,
  strokeWidth = 1.6,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="m12 3.6 2.3 4.7 5.2.8-3.75 3.65.9 5.15L12 15.5l-4.65 2.4.9-5.15L4.5 9.1l5.2-.8L12 3.6Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconServices({
  className,
  strokeWidth = 1.6,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

function IconContact({
  className,
  strokeWidth = 1.6,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5.2 5.5h13.6c1 0 1.7.8 1.7 1.7v8c0 1-.8 1.8-1.7 1.8H11l-3.8 3v-3H5.2c-1 0-1.7-.8-1.7-1.8v-8c0-.9.8-1.7 1.7-1.7Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <circle cx="9" cy="11.2" r="0.85" fill="currentColor" />
      <circle cx="12" cy="11.2" r="0.85" fill="currentColor" />
      <circle cx="15" cy="11.2" r="0.85" fill="currentColor" />
    </svg>
  );
}

const ITEMS: NavItem[] = [
  { href: "/", label: "Home", match: (p) => p === "/", Icon: IconHome },
  {
    href: "/book",
    label: "Book",
    match: (p) => p.startsWith("/book"),
    Icon: IconBook,
  },
  {
    href: "/sales",
    label: "Sales",
    match: (p) => p.startsWith("/sales") || p.startsWith("/offers"),
    Icon: IconStar,
  },
  {
    href: "/services",
    label: "Services",
    match: (p) => p.startsWith("/services"),
    Icon: IconServices,
    isServices: true,
  },
  {
    href: "/contact",
    label: "Contact",
    match: (p) => p.startsWith("/contact"),
    Icon: IconContact,
  },
];

function ActiveDots() {
  return (
    <span className="mt-0.5 flex items-center gap-1" aria-hidden>
      <span className="h-[3px] w-[3px] rounded-full bg-accent-soft" />
      <span className="h-[3px] w-[3px] rounded-full bg-accent-soft" />
      <span className="h-[3px] w-[3px] rounded-full bg-accent-soft" />
    </span>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!servicesOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setServicesOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [servicesOpen]);

  if (pathname?.startsWith("/admin")) return null;

  const servicesActive = pathname?.startsWith("/services") || servicesOpen;

  return (
    <>
      <div className="h-[4.5rem] md:hidden" aria-hidden />

      <AnimatePresence>
        {servicesOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close services menu"
              className="fixed inset-0 z-[45] bg-ink/40 backdrop-blur-[2px] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setServicesOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Select a service"
              className="fixed inset-x-0 bottom-[calc(56px+env(safe-area-inset-bottom))] z-[46] mx-auto max-w-lg px-3 pb-2 md:hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            >
              <div className="overflow-hidden rounded-t-2xl rounded-b-xl border border-accent/30 bg-accent-strong px-3.5 pb-3.5 pt-3 shadow-lift-lg">
                <div className="mb-3 flex items-center justify-between gap-3 px-0.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-soft">
                    Select service
                  </p>
                  <button
                    type="button"
                    onClick={() => setServicesOpen(false)}
                    aria-label="Close"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-accent-soft/40 bg-accent/40 text-accent-soft transition hover:bg-accent hover:text-accent-fg"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
                      <path
                        d="M6 6l12 12M18 6 6 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {SERVICES_MENU.map((s) => {
                    const current = pathname === s.href;
                    return (
                      <li key={s.href}>
                        <Link
                          href={s.href}
                          onClick={() => setServicesOpen(false)}
                          className={`flex min-h-[48px] items-center rounded-xl border px-4 py-3 text-left text-[15px] font-semibold tracking-wide transition active:scale-[0.99] ${
                            current
                              ? "border-accent-soft/50 bg-accent text-accent-fg"
                              : "border-accent/40 bg-ink/30 text-accent-soft hover:border-accent-soft/50 hover:bg-accent/35 hover:text-accent-fg"
                          }`}
                        >
                          {s.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-accent/35 bg-gradient-to-t from-accent-strong via-accent-strong to-ink md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Mobile navigation"
      >
        <ul className="relative mx-auto grid h-[56px] w-full max-w-lg grid-cols-5">
          {ITEMS.map((item, index) => {
            const { href, label, match, Icon, isServices } = item;
            const active = isServices
              ? Boolean(servicesActive)
              : match(pathname ?? "");
            const showDivider = index === 1 || index === 4;

            const inner = active ? (
              <span className="relative -mt-2 flex h-[64px] w-full flex-col items-center justify-center gap-0.5 rounded-t-lg border border-b-0 border-accent-soft/50 bg-gradient-to-b from-tint via-accent to-accent-strong px-0.5 shadow-[0_-4px_14px_rgba(13,106,84,0.4)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-accent/20 bg-surface text-accent shadow-sm">
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
                </span>
                <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-accent-fg">
                  {label}
                </span>
                <ActiveDots />
              </span>
            ) : (
              <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-accent-soft/85 transition hover:text-accent-fg">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.65} />
                <span className="text-[8px] font-semibold uppercase tracking-[0.14em]">
                  {label}
                </span>
              </span>
            );

            return (
              <li
                key={label}
                className={`relative h-full min-w-0 ${
                  showDivider
                    ? "before:absolute before:left-0 before:top-2 before:z-[1] before:h-[calc(100%-16px)] before:w-px before:bg-accent-soft/30 before:content-['']"
                    : ""
                }`}
              >
                {isServices ? (
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-haspopup="dialog"
                    onClick={() => setServicesOpen((v) => !v)}
                    className="flex h-full w-full items-stretch"
                  >
                    {inner}
                  </button>
                ) : (
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setServicesOpen(false)}
                    className="flex h-full w-full items-stretch"
                  >
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
