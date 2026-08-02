"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconCalendar,
  IconChevronDown,
  IconHome,
  IconLogout,
  IconMenu,
  IconSparkle,
} from "@/components/admin/icons";
import { greeting, initials } from "@/lib/admin-console";

const noopSubscribe = () => () => {};

export function AdminTopbar({
  username,
  title,
  subtitle,
  onMenu,
  onSignOut,
}: {
  username: string;
  title?: string;
  subtitle: string;
  onMenu: () => void;
  onSignOut: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* Greeting and date read the viewer's clock, so they only resolve after
     hydration — the server has no idea what time it is where you are. */
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
  const now = mounted ? new Date() : null;

  useEffect(() => {
    if (!menuOpen) return;
    function onDown(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const heading = title ?? `${now ? greeting(now) : "Welcome"}, ${username}`;

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink-soft transition hover:text-accent lg:hidden"
        >
          <IconMenu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
              aria-hidden
            >
              <IconSparkle className="h-4 w-4" />
            </span>
            <h1 className="truncate font-display text-xl text-ink sm:text-[1.6rem]">
              {heading}
            </h1>
          </div>
          <p className="mt-1 truncate pl-[42px] text-xs text-ink-soft">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="console-card hidden items-center gap-2 px-4 py-2.5 text-sm text-ink-soft sm:inline-flex">
          <IconCalendar className="h-4 w-4 text-accent" />
          <span className="tabular-nums">
            {now
              ? now.toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </span>
        </span>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="console-card flex items-center gap-2.5 py-1.5 pl-1.5 pr-3 transition hover:border-accent/40"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-strong text-xs font-semibold uppercase text-accent-fg"
              aria-hidden
            >
              {initials(username)}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block max-w-[8rem] truncate text-xs font-semibold text-ink">
                {username}
              </span>
              <span className="block text-[10px] text-muted">Staff</span>
            </span>
            <IconChevronDown
              className={`h-4 w-4 text-muted transition duration-300 ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {menuOpen ? (
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.99 }}
                transition={{ duration: 0.18 }}
                className="console-card absolute right-0 top-full z-30 mt-2 w-48 overflow-hidden p-1.5"
              >
                <Link
                  href="/"
                  role="menuitem"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink-soft transition hover:bg-canvas-alt hover:text-accent"
                >
                  <IconHome className="h-4 w-4" />
                  View live site
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={onSignOut}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-rose-600 transition hover:bg-rose-50"
                >
                  <IconLogout className="h-4 w-4" />
                  Sign out
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
