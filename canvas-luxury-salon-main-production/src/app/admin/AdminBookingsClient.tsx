"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Booking, BookingStatus } from "@/lib/bookings-types";
import { site } from "@/lib/site";

type Props = { initial: Booking[] };

const STATUS_FILTERS: { value: "all" | BookingStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

const UNPRICED = "__unpriced__";

/** Short public-style ref for each booking (unique per card). */
function bookingRef(id: string) {
  const compact = id.replace(/-/g, "");
  return compact.slice(-8).toUpperCase();
}

function statusCardStyles(status: BookingStatus) {
  switch (status) {
    case "pending":
      return {
        ring: "ring-amber-400/20",
        bar: "from-amber-300 via-amber-500 to-amber-700/90",
        badge: "border-amber-400/40 bg-amber-500/[0.12] text-amber-100",
        glow: "shadow-[0_20px_60px_-20px_rgba(251,191,36,0.45)]",
        wash: "text-amber-400/[0.07]",
      };
    case "confirmed":
      return {
        ring: "ring-emerald-400/18",
        bar: "from-emerald-300 via-teal-500 to-emerald-800/85",
        badge: "border-emerald-400/35 bg-emerald-500/[0.1] text-emerald-100",
        glow: "shadow-[0_20px_60px_-22px_rgba(52,211,153,0.35)]",
        wash: "text-emerald-400/[0.06]",
      };
    case "cancelled":
      return {
        ring: "ring-rose-400/18",
        bar: "from-rose-300 via-rose-500 to-rose-900/80",
        badge: "border-rose-400/35 bg-rose-500/[0.1] text-rose-100",
        glow: "shadow-[0_18px_50px_-18px_rgba(251,113,133,0.32)]",
        wash: "text-rose-400/[0.06]",
      };
    default:
      return {
        ring: "ring-white/10",
        bar: "from-white/50 to-white/15",
        badge: "border-white/15 bg-white/5 text-white/70",
        glow: "",
        wash: "text-white/[0.04]",
      };
  }
}

/** Alternate card silhouettes so the grid feels curated, not copy-paste. */
function cardShapeClass(i: number) {
  const shapes = [
    "rounded-[1.75rem] rounded-tl-sm",
    "rounded-[1.75rem] rounded-br-sm",
    "rounded-[1.75rem] rounded-tr-sm",
  ];
  return shapes[i % shapes.length];
}

export function AdminBookingsClient({ initial }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("all");

  const stats = useMemo(() => {
    return {
      all: rows.length,
      pending: rows.filter((b) => b.status === "pending").length,
      confirmed: rows.filter((b) => b.status === "confirmed").length,
      cancelled: rows.filter((b) => b.status === "cancelled").length,
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

  const filtered = useMemo(() => {
    const list = rows.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (dateFrom && b.date < dateFrom) return false;
      if (dateTo && b.date > dateTo) return false;
      if (priceFilter !== "all") {
        const pl = (b.priceLabel ?? "").trim();
        if (priceFilter === UNPRICED) return !pl;
        return pl === priceFilter;
      }
      return true;
    });
    return list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [rows, statusFilter, dateFrom, dateTo, priceFilter]);

  const filtersActive =
    statusFilter !== "all" ||
    Boolean(dateFrom) ||
    Boolean(dateTo) ||
    priceFilter !== "all";

  function clearFilters() {
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setPriceFilter("all");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

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

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black px-4 pb-24 pt-24 sm:px-6 md:px-8">
      {/* Layered backdrop — unique to admin */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(201,169,98,0.14),transparent_55%),radial-gradient(ellipse_80%_50%_at_100%_50%,rgba(201,169,98,0.06),transparent_45%),linear-gradient(180deg,#080807_0%,#000_45%,#060605_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -18deg,
            transparent,
            transparent 100px,
            rgba(201,169,98,0.9) 100px,
            rgba(201,169,98,0.9) 101px
          )`,
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/35 bg-gradient-to-br from-gold/20 to-transparent font-display text-lg text-gold-light shadow-gold"
                aria-hidden
              >
                {site.name.charAt(0)}
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold/90">
                  {site.name} · admin
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">
                  Appointment ledger
                </p>
              </div>
            </div>
            <div className="mt-6 h-px w-24 bg-gradient-to-r from-gold via-gold-light/50 to-transparent" />
            <h1 className="mt-5 font-display text-3xl tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
              Bookings
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/45">
              Har request alag card pe — ref code, filters, aur status colours se
              turant pehchano.
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="shrink-0 self-start rounded-full border border-white/12 bg-white/[0.03] px-7 py-2.5 text-[10px] uppercase tracking-[0.2em] text-white/65 transition hover:border-gold/40 hover:text-white lg:self-auto"
          >
            Sign out
          </button>
        </div>

        {/* Stats — each tile slightly different */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Inbox",
              value: stats.all,
              sub: "all requests",
              className:
                "border-white/12 bg-gradient-to-br from-white/[0.07] to-transparent",
              numClass: "text-white",
            },
            {
              label: "Awaiting",
              value: stats.pending,
              sub: "pending",
              className:
                "border-amber-400/20 bg-gradient-to-br from-amber-500/[0.08] to-transparent",
              numClass: "text-amber-100",
            },
            {
              label: "Locked in",
              value: stats.confirmed,
              sub: "confirmed",
              className:
                "border-emerald-400/18 bg-gradient-to-br from-emerald-500/[0.07] to-transparent",
              numClass: "text-emerald-100",
            },
            {
              label: "Closed",
              value: stats.cancelled,
              sub: "cancelled",
              className:
                "border-rose-400/18 bg-gradient-to-br from-rose-500/[0.07] to-transparent",
              numClass: "text-rose-100",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`relative overflow-hidden rounded-2xl border px-4 py-4 backdrop-blur-sm ${s.className}`}
            >
              <span className="absolute -right-1 -top-1 font-display text-5xl tabular-nums text-white/[0.04]">
                {s.value}
              </span>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                {s.label}
              </p>
              <p className={`mt-2 font-display text-3xl tabular-nums ${s.numClass}`}>
                {s.value}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-white/30">
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-black/55 p-5 shadow-luxury backdrop-blur-2xl sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-gold shadow-gold" />
              <h2 className="text-xs font-medium uppercase tracking-[0.28em] text-white/50">
                Refine
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs tabular-nums text-white/40">
                Showing{" "}
                <span className="font-medium text-gold-light">{filtered.length}</span>{" "}
                of {rows.length}
              </span>
              {filtersActive ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-full border border-gold/25 bg-gold/5 px-4 py-1.5 text-[10px] uppercase tracking-wider text-gold-light transition hover:bg-gold/15"
                >
                  Clear all
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-stretch">
            <div className="flex-1 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                Status
              </p>
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map(({ value, label }) => {
                  const active = statusFilter === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStatusFilter(value)}
                      className={`rounded-full px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] transition ${
                        active
                          ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light text-black shadow-md shadow-gold/20"
                          : "border border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white/90"
                      }`}
                    >
                      {label}
                      {value !== "all" && (
                        <span className="ml-1 opacity-70">
                          ·
                          {value === "pending"
                            ? stats.pending
                            : value === "confirmed"
                              ? stats.confirmed
                              : stats.cancelled}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-6 sm:flex-row lg:border-l lg:border-white/10 lg:pl-8">
              <div className="flex-1 space-y-3">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                  Appointment date
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <label className="block flex-1">
                    <span className="mb-1.5 block text-[10px] tracking-wider text-white/38">
                      From
                    </span>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full cursor-pointer rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-gold/45 focus:ring-1 focus:ring-gold/20"
                    />
                  </label>
                  <label className="block flex-1">
                    <span className="mb-1.5 block text-[10px] tracking-wider text-white/38">
                      To
                    </span>
                    <input
                      type="date"
                      value={dateTo}
                      min={dateFrom || undefined}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full cursor-pointer rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-gold/45 focus:ring-1 focus:ring-gold/20"
                    />
                  </label>
                </div>
              </div>

              <div className="flex-1 space-y-3 sm:min-w-[220px]">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                  Menu price label
                </p>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-gold/45 focus:ring-1 focus:ring-gold/20"
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
              </div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-12">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-[1.75rem] border border-dashed border-white/12 bg-white/[0.02] px-6 py-20 text-center"
              >
                <p className="font-display text-xl text-white/80">
                  {rows.length === 0
                    ? "Abhi koi booking nahi."
                    : "In filters se koi match nahi."}
                </p>
                {rows.length > 0 && filtersActive ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-full border border-gold/35 bg-gold/10 px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] text-gold-light transition hover:bg-gold/20"
                  >
                    Filters reset
                  </button>
                ) : null}
              </motion.div>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((b, i) => {
                  const st = statusCardStyles(b.status);
                  const ref = bookingRef(b.id);
                  const shape = cardShapeClass(i);
                  return (
                    <motion.li
                      key={b.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: i * 0.025 }}
                      className={`group relative overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.07] via-white/[0.02] to-transparent ring-1 ${st.ring} ${st.glow} ${shape}`}
                    >
                      {/* Top foil strip */}
                      <div
                        className={`h-1.5 w-full bg-gradient-to-r ${st.bar}`}
                        aria-hidden
                      />
                      {/* Giant watermark */}
                      <span
                        className={`pointer-events-none absolute -right-2 bottom-0 font-display text-[4.5rem] leading-none capitalize ${st.wash}`}
                        aria-hidden
                      >
                        {b.status}
                      </span>

                      <div className="relative p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold/80">
                              Ref · {ref}
                            </p>
                            <p className="mt-2 font-display text-xl text-white sm:text-2xl">
                              {b.name}
                            </p>
                            <p className="mt-1 text-[11px] text-white/40">
                              Submitted{" "}
                              {new Date(b.createdAt).toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-xl border px-2.5 py-1.5 text-[9px] uppercase tracking-[0.18em] ${st.badge}`}
                          >
                            {b.status}
                          </span>
                        </div>

                        {/* Corner brackets — unique ornament */}
                        <div
                          className="pointer-events-none absolute left-4 top-14 h-8 w-8 border-l border-t border-gold/25 transition group-hover:border-gold/40 sm:left-5 sm:top-16"
                          aria-hidden
                        />
                        <div
                          className="pointer-events-none absolute bottom-16 right-4 h-8 w-8 border-b border-r border-gold/20 transition group-hover:border-gold/35 sm:bottom-20 sm:right-5"
                          aria-hidden
                        />

                        <div className="mt-5 space-y-2 border-t border-white/8 pt-5 text-sm">
                          <a
                            href={`mailto:${encodeURIComponent(b.email)}`}
                            className="block truncate text-sm text-gold-light/95 hover:underline"
                          >
                            {b.email}
                          </a>
                          <a
                            href={`tel:${b.phone.replace(/\s/g, "")}`}
                            className="block text-white/65 transition hover:text-white"
                          >
                            {b.phone}
                          </a>
                        </div>

                        <div className="mt-5 rounded-2xl border border-white/8 bg-black/35 px-4 py-4 backdrop-blur-sm">
                          <p className="text-[9px] uppercase tracking-[0.28em] text-white/38">
                            Service
                          </p>
                          <p className="mt-2 text-sm font-medium leading-snug text-white">
                            {b.service}
                          </p>
                          <p className="mt-3 font-display text-sm text-gold-light/95">
                            {b.priceLabel?.trim() || "—"}
                          </p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="inline-flex items-center rounded-lg border border-white/12 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-white/90">
                            {b.date}
                          </span>
                          <span className="inline-flex items-center rounded-lg border border-gold/20 bg-gold/[0.06] px-3 py-1.5 font-mono text-xs text-gold-light">
                            {b.time}
                          </span>
                        </div>

                        {b.message ? (
                          <p className="mt-4 border-l-2 border-gold/30 pl-3 text-xs leading-relaxed text-white/48">
                            {b.message}
                          </p>
                        ) : null}

                        <label className="mt-5 block">
                          <span className="mb-2 block text-[9px] uppercase tracking-[0.22em] text-white/38">
                            Update status
                          </span>
                          <select
                            value={b.status}
                            disabled={busy === b.id}
                            onChange={(e) =>
                              setStatus(b.id, e.target.value as BookingStatus)
                            }
                            aria-label={`Booking status for ${b.name}`}
                            className="w-full cursor-pointer rounded-xl border border-white/12 bg-black/70 px-3 py-3 text-sm capitalize text-white outline-none transition focus:border-gold/45 focus:ring-1 focus:ring-gold/20 disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </label>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
