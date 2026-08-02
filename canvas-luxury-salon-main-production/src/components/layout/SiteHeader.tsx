"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SiteContent } from "@/lib/cms-types";
import { site as siteFallback } from "@/lib/site";

const simpleLinks = [
  { href: "/offers", label: "Offers" },
  { href: "/contact", label: "Contact" },
] as const;

const servicesSub = [
  { href: "/services/hair", label: "Hair" },
  { href: "/services/makeup", label: "Makeup" },
  { href: "/services/facial", label: "Facial" },
  { href: "/services/body-spa", label: "Wax & Body" },
  { href: "/services/nails", label: "Mani, pedi & nails" },
  { href: "/services/mehndi", label: "Mehndi" },
] as const;

function servicesActive(pathname: string) {
  return pathname.startsWith("/services/");
}

export function SiteHeader({ site: siteProp }: { site?: SiteContent }) {
  const site = siteProp ?? siteFallback;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [deskServicesOpen, setDeskServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    /* Close any open menus/overlays after in-app navigations (mobile drawer + dropdowns). */
    /* eslint-disable react-hooks/set-state-in-effect -- route-driven UI reset for navigation overlays */
    setOpen(false);
    setMobileServicesOpen(false);
    setDeskServicesOpen(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname]);

  const linkBase =
    "relative text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300";

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "border-b border-line/80 bg-canvas/85 py-2 shadow-soft backdrop-blur-xl sm:py-2.5"
          : "border-b border-transparent bg-canvas/40 py-3 backdrop-blur-md sm:py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pt-[env(safe-area-inset-top)] sm:px-6 md:px-8">
        <Link
          href="/"
          aria-label={site.name}
          className="group flex min-h-[44px] shrink-0 items-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- brand SVG logo */}
          <img
            src={site.logo}
            alt={site.name}
            className="h-10 w-auto transition duration-500 group-hover:scale-[1.03] xs:h-11 md:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          <Link
            href="/"
            className={`${linkBase} ${
              pathname === "/" ? "text-accent" : "text-ink-soft hover:text-accent"
            }`}
          >
            Home
            {pathname === "/" && (
              <motion.span
                layoutId="navline"
                className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-accent"
              />
            )}
          </Link>

          <div
            className="relative py-1"
            onMouseEnter={() => setDeskServicesOpen(true)}
            onMouseLeave={() => setDeskServicesOpen(false)}
          >
            <Link
              href="/services/hair"
              className={`${linkBase} flex items-center gap-1.5 ${
                servicesActive(pathname)
                  ? "text-accent"
                  : "text-ink-soft hover:text-accent"
              }`}
            >
              Services
              <motion.span
                className="text-[9px] opacity-60"
                animate={{ rotate: deskServicesOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                aria-hidden
              >
                ▾
              </motion.span>
              {servicesActive(pathname) && (
                <motion.span
                  layoutId="navline"
                  className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-accent"
                />
              )}
            </Link>

            <AnimatePresence>
              {deskServicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.99 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-1/2 top-full z-50 min-w-[230px] -translate-x-1/2 pt-3"
                >
                  <div className="overflow-hidden rounded-2xl border border-line bg-surface/95 p-1.5 shadow-soft backdrop-blur-xl">
                    {servicesSub.map((s, i) => (
                      <motion.div
                        key={s.href}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 * i, duration: 0.25 }}
                      >
                        <Link
                          href={s.href}
                          className={`block rounded-xl px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] transition ${
                            pathname === s.href
                              ? "bg-accent-soft text-accent"
                              : "text-ink-soft hover:bg-canvas-alt hover:text-accent"
                          }`}
                        >
                          {s.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {simpleLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`${linkBase} ${
                  active ? "text-accent" : "text-ink-soft hover:text-accent"
                }`}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="navline"
                    className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="hidden min-h-[42px] items-center justify-center rounded-full bg-accent px-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-fg shadow-lift transition duration-300 hover:bg-accent-strong hover:shadow-lift-lg active:scale-[0.98] sm:inline-flex"
          >
            Book now
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full border border-line bg-surface/80 transition hover:border-accent/40 lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <motion.span
              className="block h-[1.5px] w-5 rounded-full bg-ink"
              animate={open ? { rotate: 45, y: 3.25 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.span
              className="block h-[1.5px] w-5 rounded-full bg-ink"
              animate={open ? { rotate: -45, y: -3.25 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
            />
          </button>
        </div>
      </div>

      <AnimatePresence mode="sync">
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-canvas/95 backdrop-blur-xl lg:hidden"
          >
            <motion.nav
              className="flex flex-col gap-1 px-4 pb-6 pt-4 sm:px-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.04 },
                },
              }}
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  show: { opacity: 1, x: 0 },
                }}
              >
                <Link
                  href="/"
                  className={`flex min-h-[48px] items-center rounded-xl px-3 text-sm uppercase tracking-[0.18em] transition ${
                    pathname === "/"
                      ? "bg-accent-soft text-accent"
                      : "text-ink-soft hover:bg-canvas-alt"
                  }`}
                >
                  Home
                </Link>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  show: { opacity: 1, x: 0 },
                }}
              >
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen((v) => !v)}
                  aria-expanded={mobileServicesOpen}
                  className="flex min-h-[48px] w-full items-center justify-between rounded-xl px-3 text-sm uppercase tracking-[0.18em] text-ink-soft transition hover:bg-canvas-alt"
                >
                  Services
                  <motion.span
                    className="text-xs"
                    animate={{ rotate: mobileServicesOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    aria-hidden
                  >
                    ▾
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.26 }}
                      className="overflow-hidden"
                    >
                      <div className="my-1 ml-3 flex flex-col border-l-2 border-accent/25 pl-3">
                        {servicesSub.map((s) => (
                          <Link
                            key={s.href}
                            href={s.href}
                            className={`min-h-[44px] rounded-lg px-3 py-2.5 text-[11px] uppercase tracking-[0.14em] transition ${
                              pathname === s.href
                                ? "text-accent"
                                : "text-muted hover:text-accent"
                            }`}
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {simpleLinks.map((l) => (
                <motion.div
                  key={l.href}
                  variants={{
                    hidden: { opacity: 0, x: -12 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={l.href}
                    className={`flex min-h-[48px] items-center rounded-xl px-3 text-sm uppercase tracking-[0.18em] transition ${
                      pathname === l.href
                        ? "bg-accent-soft text-accent"
                        : "text-ink-soft hover:bg-canvas-alt"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                className="mt-3"
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Link href="/book" className="btn-primary w-full">
                  Book appointment
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
