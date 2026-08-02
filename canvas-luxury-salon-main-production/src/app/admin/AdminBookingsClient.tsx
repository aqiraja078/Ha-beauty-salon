"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AdminHomeEditor } from "@/components/admin/AdminHomeEditor";
import { AdminServicesEditor } from "@/components/admin/AdminServicesEditor";
import { AdminSidebar, type ConsoleView } from "@/components/admin/AdminSidebar";
import { AdminSiteEditor } from "@/components/admin/AdminSiteEditor";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { BookingDrawer } from "@/components/admin/BookingDrawer";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { StatCard } from "@/components/admin/console-ui";
import {
  IconArrowRight,
  IconCheckCircle,
  IconClock,
  IconInbox,
  IconLogout,
  IconSearch,
  IconXCircle,
} from "@/components/admin/icons";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { countToday, dailySeries } from "@/lib/admin-console";
import type { Booking, BookingStatus } from "@/lib/bookings-types";
import type { HomeContent, ServiceMenus, SiteContent } from "@/lib/cms-types";

type Props = {
  initial: Booking[];
  username: string;
  initialSite: SiteContent;
  initialHome: HomeContent;
  initialServices: ServiceMenus;
};

type StatusFilter = "all" | BookingStatus;

const UNPRICED = "__unpriced__";

const VIEW_COPY: Record<ConsoleView, { title?: string; subtitle: string }> = {
  dashboard: { subtitle: "Welcome back to your dashboard" },
  home: {
    title: "Home content",
    subtitle: "Edit hero, gallery, about — changes show on the live homepage",
  },
  offers: {
    title: "Offers",
    subtitle:
      "Add, edit, reorder packages — live on home Offers section and /offers",
  },
  bookings: {
    title: "All Bookings",
    subtitle: "Search, filter and update every request",
  },
  services: {
    title: "Service menus",
    subtitle: "Add, edit or remove prices — live on service pages & booking form",
  },
  settings: {
    title: "Settings",
    subtitle: "Site identity, account and quick links",
  },
};

export function AdminBookingsClient({
  initial,
  username,
  initialSite,
  initialHome,
  initialServices,
}: Props) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [view, setView] = useState<ConsoleView>("dashboard");
  const [navOpen, setNavOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  const stats = useMemo(
    () => ({
      all: rows.length,
      pending: rows.filter((b) => b.status === "pending").length,
      confirmed: rows.filter((b) => b.status === "confirmed").length,
      cancelled: rows.filter((b) => b.status === "cancelled").length,
    }),
    [rows]
  );

  const priceOptions = useMemo(() => {
    const set = new Set<string>();
    for (const b of rows) {
      const p = (b.priceLabel ?? "").trim();
      if (p) set.add(p);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  const hasUnpriced = useMemo(
    () => rows.some((b) => !(b.priceLabel ?? "").trim()),
    [rows]
  );

  const newestFirst = useMemo(
    () =>
      [...rows].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return newestFirst.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (dateFrom && b.date < dateFrom) return false;
      if (dateTo && b.date > dateTo) return false;
      if (priceFilter !== "all") {
        const pl = (b.priceLabel ?? "").trim();
        if (priceFilter === UNPRICED ? Boolean(pl) : pl !== priceFilter)
          return false;
      }
      if (
        q &&
        ![b.name, b.email, b.phone, b.service, b.id].some((v) =>
          v.toLowerCase().includes(q)
        )
      )
        return false;
      return true;
    });
  }, [newestFirst, statusFilter, query, dateFrom, dateTo, priceFilter]);

  const filtersActive =
    statusFilter !== "all" ||
    Boolean(query.trim()) ||
    Boolean(dateFrom) ||
    Boolean(dateTo) ||
    priceFilter !== "all";

  const selected = selectedId
    ? (rows.find((b) => b.id === selectedId) ?? null)
    : null;

  function clearFilters() {
    setStatusFilter("all");
    setQuery("");
    setDateFrom("");
    setDateTo("");
    setPriceFilter("all");
  }

  function goTo(v: ConsoleView) {
    setView(v);
    setNavOpen(false);
  }

  /** Stat tiles double as shortcuts into the filtered ledger. */
  function drillDown(status: StatusFilter) {
    setStatusFilter(status);
    setView("bookings");
  }

  const logout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }, [router]);

  async function setStatus(id: string, status: BookingStatus) {
    setBusy(id);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = (await res.json()) as Booking;
      setRows((r) => r.map((b) => (b.id === id ? updated : b)));
    } finally {
      setBusy(null);
    }
  }

  async function removeBooking(id: string) {
    setBusy(id);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setRows((r) => r.filter((b) => b.id !== id));
      setSelectedId((cur) => (cur === id ? null : cur));
    } finally {
      setBusy(null);
    }
  }

  const tiles = [
    {
      key: "all" as StatusFilter,
      icon: <IconInbox className="h-5 w-5" />,
      iconWrap: "bg-gilt/10 text-gilt",
      tone: "text-gilt",
      label: "Inbox",
      value: stats.all,
      sub: "All requests",
      trend: countToday(rows),
      series: dailySeries(rows),
    },
    {
      key: "pending" as StatusFilter,
      icon: <IconClock className="h-5 w-5" />,
      iconWrap: "bg-amber-50 text-amber-500",
      tone: "text-amber-500",
      label: "Pending",
      value: stats.pending,
      sub: "Waiting approval",
      trend: countToday(rows, "pending"),
      series: dailySeries(rows, 7, "pending"),
    },
    {
      key: "confirmed" as StatusFilter,
      icon: <IconCheckCircle className="h-5 w-5" />,
      iconWrap: "bg-accent-soft text-accent",
      tone: "text-accent",
      label: "Confirmed",
      value: stats.confirmed,
      sub: "Locked-in clients",
      trend: countToday(rows, "confirmed"),
      series: dailySeries(rows, 7, "confirmed"),
    },
    {
      key: "cancelled" as StatusFilter,
      icon: <IconXCircle className="h-5 w-5" />,
      iconWrap: "bg-rose-50 text-rose-500",
      tone: "text-rose-500",
      label: "Cancelled",
      value: stats.cancelled,
      sub: "Need review",
      trend: -countToday(rows, "cancelled"),
      series: dailySeries(rows, 7, "cancelled"),
    },
  ];

  return (
    <ThemeScope scope="admin" className="min-h-screen">
      <div className="flex min-h-screen">
        <aside className="hidden w-[236px] shrink-0 border-r border-line bg-canvas-alt lg:block">
          <div className="sticky top-0 h-screen">
            <AdminSidebar
              view={view}
              onView={goTo}
              siteName={initialSite.name}
            />
          </div>
        </aside>

        <AnimatePresence>
          {navOpen ? (
            <motion.div
              className="fixed inset-0 z-50 flex lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setNavOpen(false)}
                className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 34 }}
                className="relative h-full w-[250px]"
              >
                <AdminSidebar
                  view={view}
                  onView={goTo}
                  onClose={() => setNavOpen(false)}
                  siteName={initialSite.name}
                />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <AdminTopbar
            username={username}
            title={VIEW_COPY[view].title}
            subtitle={VIEW_COPY[view].subtitle}
            onMenu={() => setNavOpen(true)}
            onSignOut={logout}
          />

          {view === "dashboard" ? (
            <>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {tiles.map((t) => (
                  <StatCard
                    key={t.key}
                    icon={t.icon}
                    iconWrap={t.iconWrap}
                    label={t.label}
                    value={t.value}
                    sub={t.sub}
                    trend={t.trend}
                    series={t.series}
                    tone={t.tone}
                    active={false}
                    onClick={() => drillDown(t.key)}
                  />
                ))}
              </div>

              <section className="console-card mt-6 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-lg text-ink">
                    Recent Bookings
                  </h2>
                  <button
                    type="button"
                    onClick={() => drillDown("all")}
                    className="console-btn"
                  >
                    View All Bookings
                    <IconArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5">
                  <BookingsTable
                    rows={newestFirst.slice(0, 5)}
                    onView={(b) => setSelectedId(b.id)}
                    onDelete={removeBooking}
                    busyId={busy}
                    emptyTitle="Abhi koi booking nahi."
                    emptyHint="Nayi request aate hi yahan dikhegi."
                  />
                </div>
              </section>
            </>
          ) : null}

          {view === "home" ? <AdminHomeEditor initial={initialHome} /> : null}

          {view === "offers" ? (
            <AdminHomeEditor initial={initialHome} onlyTab="offers" />
          ) : null}

          {view === "services" ? (
            <AdminServicesEditor initial={initialServices} />
          ) : null}

          {view === "bookings" ? (
            <section className="console-card mt-7 p-5 sm:p-6">
              <div className="flex flex-col gap-4 border-b border-line pb-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["all", "All", stats.all],
                      ["pending", "Pending", stats.pending],
                      ["confirmed", "Confirmed", stats.confirmed],
                      ["cancelled", "Cancelled", stats.cancelled],
                    ] as const
                  ).map(([value, label, count]) => {
                    const active = statusFilter === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setStatusFilter(value)}
                        aria-pressed={active}
                        className={`min-h-[36px] rounded-full px-4 text-xs font-medium transition duration-300 ${
                          active
                            ? "bg-gradient-to-r from-accent to-accent-strong text-accent-fg shadow-lift"
                            : "border border-line bg-surface text-ink-soft hover:border-accent/45 hover:text-accent"
                        }`}
                      >
                        {label}
                        <span className="ml-1.5 tabular-nums opacity-70">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <label className="relative w-full lg:w-64">
                  <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Name, email, phone, service…"
                    aria-label="Search bookings"
                    className="console-field pl-9"
                  />
                </label>
              </div>

              <div className="grid gap-4 py-5 sm:grid-cols-2 xl:grid-cols-4">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Date from
                  </span>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="console-field cursor-pointer"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Date to
                  </span>
                  <input
                    type="date"
                    value={dateTo}
                    min={dateFrom || undefined}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="console-field cursor-pointer"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Price label
                  </span>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="console-field cursor-pointer"
                  >
                    <option value="all">All prices</option>
                    {hasUnpriced ? (
                      <option value={UNPRICED}>No price label</option>
                    ) : null}
                    {priceOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex items-end justify-between gap-3 sm:justify-start">
                  <span className="text-xs tabular-nums text-muted">
                    Showing{" "}
                    <span className="font-semibold text-accent">
                      {filtered.length}
                    </span>{" "}
                    of {rows.length}
                  </span>
                  {filtersActive ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="console-btn-soft"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
              </div>

              <BookingsTable
                rows={filtered}
                onView={(b) => setSelectedId(b.id)}
                onDelete={removeBooking}
                busyId={busy}
                emptyTitle={
                  rows.length === 0
                    ? "Abhi koi booking nahi."
                    : "In filters se koi match nahi."
                }
                emptyHint={
                  rows.length > 0 ? "Filters clear kar ke dobara try karo." : undefined
                }
              />
            </section>
          ) : null}

          {view === "settings" ? (
            <>
              <AdminSiteEditor initial={initialSite} />
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <section className="console-card p-6">
                  <h2 className="font-display text-lg text-ink">Account</h2>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
                      <dt className="text-muted">Signed in as</dt>
                      <dd className="font-medium text-ink">{username}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
                      <dt className="text-muted">Role</dt>
                      <dd className="font-medium text-ink">Staff</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted">Salon</dt>
                      <dd className="font-medium text-ink">{initialSite.name}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={logout}
                    className="mt-6 inline-flex min-h-[40px] items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 text-xs font-semibold text-rose-600 transition duration-300 hover:bg-rose-100"
                  >
                    <IconLogout className="h-4 w-4" />
                    Sign out
                  </button>
                </section>

                <section className="console-card p-6">
                  <h2 className="font-display text-lg text-ink">Quick links</h2>
                  <p className="mt-2 text-sm text-ink-soft">
                    Home, Offers aur Services sidebar se edit karein — live site
                    pe turant dikhega.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link href="/" className="console-btn-soft">
                      Live site
                    </Link>
                    <Link href="/offers" className="console-btn-soft">
                      Offers page
                    </Link>
                    <Link href="/book" className="console-btn-soft">
                      Booking form
                    </Link>
                    <Link href="/services/hair" className="console-btn-soft">
                      Hair menu
                    </Link>
                  </div>
                </section>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <BookingDrawer
        booking={selected}
        busy={busy === selected?.id}
        onClose={() => setSelectedId(null)}
        onStatus={setStatus}
        onDelete={removeBooking}
      />
    </ThemeScope>
  );
}
