"use client";

import { motion } from "framer-motion";
import {
  ConsoleCrest,
  IconCalendar,
  IconClose,
  IconDashboard,
  IconHome,
  IconScissors,
  IconSettings,
  IconTag,
} from "@/components/admin/icons";
export type ConsoleView =
  | "dashboard"
  | "home"
  | "offers"
  | "bookings"
  | "services"
  | "settings";

type NavItem = {
  view: ConsoleView;
  label: string;
  Icon: typeof IconHome;
};

const NAV: NavItem[] = [
  { view: "dashboard", label: "Dashboard", Icon: IconDashboard },
  { view: "home", label: "Home", Icon: IconHome },
  { view: "offers", label: "Offers", Icon: IconTag },
  { view: "bookings", label: "Bookings", Icon: IconCalendar },
  { view: "services", label: "Services", Icon: IconScissors },
  { view: "settings", label: "Setting", Icon: IconSettings },
];

export function AdminSidebar({
  view,
  onView,
  onClose,
  siteName,
}: {
  view: ConsoleView;
  onView: (v: ConsoleView) => void;
  onClose?: () => void;
  siteName: string;
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden border-r border-line bg-canvas-alt">
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition hover:text-accent lg:hidden"
        >
          <IconClose className="h-4 w-4" />
        </button>
      ) : null}

      <div className="px-6 pb-6 pt-8 text-center">
        <ConsoleCrest
          letter={siteName.charAt(0)}
          className="mx-auto h-16 w-16 text-accent"
        />
        <p className="mt-3 font-display text-sm uppercase tracking-[0.16em] text-ink">
          {siteName}
        </p>
        <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-muted">
          Staff console
        </p>
      </div>

      <nav className="flex flex-col gap-1.5 px-4">
        {NAV.map(({ view: v, label, Icon }) => {
          const active = view === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onView(v)}
              aria-current={active ? "page" : undefined}
              className={`console-nav relative isolate ${
                active
                  ? "text-accent-fg"
                  : "text-ink-soft hover:bg-surface hover:text-accent"
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="console-nav-active"
                  className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-accent to-accent-strong shadow-lift"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              ) : null}
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      <svg
        viewBox="0 0 160 150"
        className="pointer-events-none mx-auto mb-8 mt-auto w-36 max-w-full shrink-0 text-accent/30"
        aria-hidden
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M80 142V52" />
          <path d="M80 126c-16 2-27-6-31-21 15-3 27 5 31 21ZM80 126c16 2 27-6 31-21-15-3-27 5-31 21Z" />
          <path d="M80 104c-13 2-22-5-25-17 12-2 22 4 25 17ZM80 104c13 2 22-5 25-17-12-2-22 4-25 17Z" />
          <path d="M80 82c-10 2-17-4-19-13 9-1 17 3 19 13ZM80 82c10 2 17-4 19-13-9-1-17 3-19 13Z" />
          <path d="M80 52a6 6 0 1 1 5-9 10 10 0 1 1-12 14 14 14 0 1 1 18-20" />
          <path d="M30 138q50-16 100 0" />
        </g>
      </svg>
    </div>
  );
}
