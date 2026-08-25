"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AdminDayCalendar } from "@/components/admin/AdminDayCalendar";
import { AdminClientsPanel } from "@/components/admin/AdminClientsPanel";
import { AdminBlogPanel } from "@/components/admin/AdminBlogPanel";
import { AdminCoursesPanel } from "@/components/admin/AdminCoursesPanel";
import { AdminJobsPanel } from "@/components/admin/AdminJobsPanel";
import { AdminHomeEditor } from "@/components/admin/AdminHomeEditor";
import { AdminServicesEditor } from "@/components/admin/AdminServicesEditor";
import { AdminSidebar, type ConsoleView } from "@/components/admin/AdminSidebar";
import { AdminSiteEditor } from "@/components/admin/AdminSiteEditor";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { BlockedDatesPanel } from "@/components/admin/BlockedDatesPanel";
import {
  BookingDrawer,
  type BookingPatch,
} from "@/components/admin/BookingDrawer";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { SalesStatCard, StatCard } from "@/components/admin/console-ui";
import {
  IconArrowRight,
  IconBell,
  IconCheckCircle,
  IconClock,
  IconDownload,
  IconInbox,
  IconLogout,
  IconSales,
  IconSearch,
  IconXCircle,
} from "@/components/admin/icons";
import { ThemeScope } from "@/components/ui/ThemeScope";
import {
  bookingsToCsv,
  downloadCsv,
  salesByService,
} from "@/lib/admin-booking-utils";
import {
  confirmedSales,
  countToday,
  dailySeries,
  formatSalesPkr,
  monthlySalesSeries,
} from "@/lib/admin-console";
import type {
  Booking,
  BookingArea,
  BookingStatus,
} from "@/lib/bookings-types";
import { BOOKING_AREAS } from "@/lib/bookings-types";
import type { HomeContent, ServiceMenus, SiteContent } from "@/lib/cms-types";

type Props = {
  initial: Booking[];
  username: string;
  initialSite: SiteContent;
  initialHome: HomeContent;
  initialServices: ServiceMenus;
};

type StatusFilter = "all" | BookingStatus;
type AreaFilter = "all" | BookingArea;

const UNPRICED = "__unpriced__";
const NOTIFY_KEY = "ha-admin-notify";

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
  calendar: {
    title: "Day calendar",
    subtitle: "Time slots and areas for one day",
  },
  clients: {
    title: "Clients",
    subtitle: "Manual client book — save names, phone, notes",
  },
  blog: {
    title: "Blog",
    subtitle: "Add and publish posts for the public blog",
  },
  courses: {
    title: "Courses",
    subtitle: "Beauty training courses — add, edit, publish",
  },
  jobs: {
    title: "Jobs",
    subtitle: "Career listings — active roles on the site",
  },
  services: {
    title: "Service menus",
    subtitle: "Add, edit or remove prices — live on service pages & booking form",
  },
  settings: {
    title: "Settings",
    subtitle: "Site identity, blocked dates, alerts and account",
  },
};

function playNotifyBeep() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.stop(ctx.currentTime + 0.4);
    void ctx.resume();
  } catch {
    /* ignore */
  }
}

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
  const [areaFilter, setAreaFilter] = useState<AreaFilter>("all");
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [calendarDay, setCalendarDay] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [notifyOn, setNotifyOn] = useState(false);
  const knownIdsRef = useRef<Set<string>>(new Set(initial.map((b) => b.id)));
  const notifyReadyRef = useRef(false);

  useEffect(() => {
    try {
      setNotifyOn(localStorage.getItem(NOTIFY_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      notifyReadyRef.current = true;
    }, 2500);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const res = await fetch("/api/bookings", { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const next = (await res.json()) as Booking[];
        if (!Array.isArray(next) || cancelled) return;

        const prev = knownIdsRef.current;
        const fresh = next.filter((b) => !prev.has(b.id));
        knownIdsRef.current = new Set(next.map((b) => b.id));
        setRows(next);

        if (notifyReadyRef.current && notifyOn && fresh.length > 0) {
          playNotifyBeep();
          const newest = fresh[0];
          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            try {
              new Notification(`New booking — ${newest.name}`, {
                body: `${newest.service} · ${newest.date} ${newest.time}`,
              });
            } catch {
              /* ignore */
            }
          }
        }
      } catch {
        /* ignore */
      }
    }
    void poll();
    const id = window.setInterval(poll, 20000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [notifyOn]);

  const stats = useMemo(
    () => ({
      all: rows.length,
      pending: rows.filter((b) => b.status === "pending").length,
      confirmed: rows.filter((b) => b.status === "confirmed").length,
      completed: rows.filter((b) => b.status === "completed").length,
      no_show: rows.filter((b) => b.status === "no_show").length,
      cancelled: rows.filter((b) => b.status === "cancelled").length,
    }),
    [rows]
  );

  const sales = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const monthName = now.toLocaleString("en", { month: "long" });
    return {
      month: confirmedSales(rows, { year, month }),
      year: confirmedSales(rows, { year }),
      monthName,
      yearLabel: String(year),
      series: monthlySalesSeries(rows, 6),
      byServiceMonth: salesByService(rows, { year, month }),
      byServiceYear: salesByService(rows, { year }),
    };
  }, [rows]);

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
      if (areaFilter !== "all" && b.area !== areaFilter) return false;
      if (dateFrom && b.date < dateFrom) return false;
      if (dateTo && b.date > dateTo) return false;
      if (priceFilter !== "all") {
        const pl = (b.priceLabel ?? "").trim();
        if (priceFilter === UNPRICED ? Boolean(pl) : pl !== priceFilter)
          return false;
      }
      if (
        q &&
        ![b.name, b.email, b.phone, b.service, b.id, b.area ?? ""].some((v) =>
          v.toLowerCase().includes(q)
        )
      )
        return false;
      return true;
    });
  }, [
    newestFirst,
    statusFilter,
    areaFilter,
    query,
    dateFrom,
    dateTo,
    priceFilter,
  ]);

  const filtersActive =
    statusFilter !== "all" ||
    areaFilter !== "all" ||
    Boolean(query.trim()) ||
    Boolean(dateFrom) ||
    Boolean(dateTo) ||
    priceFilter !== "all";

  const selected = selectedId
    ? (rows.find((b) => b.id === selectedId) ?? null)
    : null;

  function clearFilters() {
    setStatusFilter("all");
    setAreaFilter("all");
    setQuery("");
    setDateFrom("");
    setDateTo("");
    setPriceFilter("all");
  }

  function goTo(v: ConsoleView) {
    setView(v);
    setNavOpen(false);
  }

  function drillDown(status: StatusFilter) {
    setStatusFilter(status);
    setView("bookings");
  }

  function exportFiltered() {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`ha-bookings-${stamp}.csv`, bookingsToCsv(filtered));
  }

  function exportSalesMonth() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const monthRows = rows.filter(
      (b) => b.status === "completed" && b.date.startsWith(`${y}-${m}`)
    );
    downloadCsv(`ha-sales-${y}-${m}.csv`, bookingsToCsv(monthRows));
  }

  async function enableNotifications() {
    try {
      if (typeof Notification !== "undefined") {
        const perm = await Notification.requestPermission();
        if (perm !== "granted") {
          setNotifyOn(false);
          localStorage.setItem(NOTIFY_KEY, "0");
          return;
        }
      }
      setNotifyOn(true);
      localStorage.setItem(NOTIFY_KEY, "1");
      playNotifyBeep();
    } catch {
      setNotifyOn(true);
      localStorage.setItem(NOTIFY_KEY, "1");
    }
  }

  function disableNotifications() {
    setNotifyOn(false);
    try {
      localStorage.setItem(NOTIFY_KEY, "0");
    } catch {
      /* ignore */
    }
  }

  const logout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }, [router]);

  async function patchBookingRow(id: string, patch: BookingPatch) {
    setBusy(id);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
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

  const statusChips = [
    ["all", "All", stats.all],
    ["pending", "Pending", stats.pending],
    ["confirmed", "Confirmed", stats.confirmed],
    ["completed", "Done", stats.completed],
    ["no_show", "No-show", stats.no_show],
    ["cancelled", "Cancelled", stats.cancelled],
  ] as const;

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
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <SalesStatCard
                  icon={<IconSales className="h-5 w-5" />}
                  iconWrap="bg-accent-soft text-accent"
                  label="This month sales"
                  amountLabel={sales.month.labeled}
                  sub={`${sales.month.count} done · ${sales.monthName}`}
                  series={sales.series}
                  tone="text-accent"
                  onClick={() => drillDown("completed")}
                />
                <SalesStatCard
                  icon={<IconSales className="h-5 w-5" />}
                  iconWrap="bg-gilt/15 text-gilt"
                  label="This year sales"
                  amountLabel={sales.year.labeled}
                  sub={`${sales.year.count} done · ${sales.yearLabel}`}
                  series={sales.series}
                  tone="text-gilt"
                  onClick={() => drillDown("completed")}
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                  <div>
                    <h2 className="font-display text-lg text-ink">
                      Sales by service
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      {sales.monthName} — Done bookings only
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={exportSalesMonth}
                    className="console-btn-soft"
                  >
                    <IconDownload className="h-4 w-4" />
                    Export month CSV
                  </button>
                </div>
                {sales.byServiceMonth.length === 0 ? (
                  <p className="mt-4 text-sm text-muted">
                    Is mahine ki Done sales abhi nahi.
                  </p>
                ) : (
                  <ul className="mt-4 divide-y divide-line">
                    {sales.byServiceMonth.slice(0, 8).map((row) => (
                      <li
                        key={row.service}
                        className="flex items-center justify-between gap-3 py-2.5 text-sm"
                      >
                        <span className="min-w-0 truncate text-ink">
                          {row.service}
                          <span className="ml-2 text-xs text-muted">
                            ×{row.count}
                          </span>
                        </span>
                        <span className="shrink-0 font-semibold tabular-nums text-accent">
                          {formatSalesPkr(row.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

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

          {view === "clients" ? <AdminClientsPanel /> : null}

          {view === "blog" ? <AdminBlogPanel /> : null}

          {view === "courses" ? <AdminCoursesPanel /> : null}

          {view === "jobs" ? <AdminJobsPanel /> : null}

          {view === "calendar" ? (
            <section className="console-card mt-7 p-5 sm:p-6">
              <div className="mb-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAreaFilter("all")}
                  aria-pressed={areaFilter === "all"}
                  className={`min-h-[36px] rounded-full px-4 text-xs font-medium transition ${
                    areaFilter === "all"
                      ? "bg-gradient-to-r from-accent to-accent-strong text-accent-fg shadow-lift"
                      : "border border-line bg-surface text-ink-soft hover:border-accent/45"
                  }`}
                >
                  All areas
                </button>
                {BOOKING_AREAS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAreaFilter(a.id)}
                    aria-pressed={areaFilter === a.id}
                    className={`min-h-[36px] rounded-full px-4 text-xs font-medium transition ${
                      areaFilter === a.id
                        ? "bg-gradient-to-r from-accent to-accent-strong text-accent-fg shadow-lift"
                        : "border border-line bg-surface text-ink-soft hover:border-accent/45"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
              <AdminDayCalendar
                rows={rows}
                day={calendarDay}
                onDayChange={setCalendarDay}
                areaFilter={areaFilter}
                onView={(b) => setSelectedId(b.id)}
              />
            </section>
          ) : null}

          {view === "bookings" ? (
            <section className="console-card mt-7 p-5 sm:p-6">
              <div className="flex flex-col gap-4 border-b border-line pb-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {statusChips.map(([value, label, count]) => {
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

                <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
                  <label className="relative min-w-[180px] flex-1 lg:w-56">
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
                  <button
                    type="button"
                    onClick={exportFiltered}
                    className="console-btn-soft shrink-0"
                  >
                    <IconDownload className="h-4 w-4" />
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-b border-line py-4">
                <span className="self-center text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Area
                </span>
                <button
                  type="button"
                  onClick={() => setAreaFilter("all")}
                  aria-pressed={areaFilter === "all"}
                  className={`min-h-[32px] rounded-full px-3 text-xs font-medium transition ${
                    areaFilter === "all"
                      ? "border border-accent/35 bg-accent-soft text-accent"
                      : "border border-line bg-surface text-ink-soft"
                  }`}
                >
                  All
                </button>
                {BOOKING_AREAS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAreaFilter(a.id)}
                    aria-pressed={areaFilter === a.id}
                    className={`min-h-[32px] rounded-full px-3 text-xs font-medium transition ${
                      areaFilter === a.id
                        ? "border border-accent/35 bg-accent-soft text-accent"
                        : "border border-line bg-surface text-ink-soft"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
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
                  rows.length > 0
                    ? "Filters clear kar ke dobara try karo."
                    : undefined
                }
              />
            </section>
          ) : null}

          {view === "settings" ? (
            <>
              <AdminSiteEditor initial={initialSite} />
              <div className="mt-4">
                <BlockedDatesPanel />
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <section className="console-card p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <IconBell className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="font-display text-lg text-ink">
                        New booking alerts
                      </h2>
                      <p className="mt-1 text-sm text-ink-soft">
                        Sound + browser notification jab naya booking aaye
                        (console open hone par). Email: Resend +{" "}
                        <code className="text-xs">ADMIN_NOTIFY_EMAIL</code>{" "}
                        (default salon email).
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {notifyOn ? (
                      <button
                        type="button"
                        onClick={disableNotifications}
                        className="console-btn-soft"
                      >
                        Alerts on — turn off
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void enableNotifications()}
                        className="console-btn"
                      >
                        Enable sound &amp; browser alerts
                      </button>
                    )}
                  </div>
                </section>

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
                      <dd className="font-medium text-ink">
                        {initialSite.name}
                      </dd>
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

                <section className="console-card p-6 lg:col-span-2">
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
        allBookings={rows}
        busy={busy === selected?.id}
        salonName={initialSite.name}
        onClose={() => setSelectedId(null)}
        onPatch={patchBookingRow}
        onDelete={removeBooking}
        onOpenBooking={(id) => setSelectedId(id)}
      />
    </ThemeScope>
  );
}
