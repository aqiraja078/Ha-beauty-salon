"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  IconCalendar,
  IconCheckCircle,
  IconClock,
  IconCourse,
  IconFilter,
  IconMail,
  IconMoreVertical,
  IconPhone,
  IconSearch,
  IconUsers,
  IconXCircle,
  IconChevronLeft,
  IconChevronRight,
} from "@/components/admin/icons";
import { initials } from "@/lib/admin-console";
import type {
  CourseEnrollment,
  CourseEnrollmentStatus,
} from "@/lib/course-enrollments-types";

type StatusFilter = "all" | CourseEnrollmentStatus;

const PAGE_SIZES = [5, 10, 20] as const;

const STATUS_META: Record<
  CourseEnrollmentStatus,
  { label: string; pill: string; Icon: typeof IconClock }
> = {
  pending: {
    label: "Pending",
    pill: "border-amber-200/80 bg-amber-50 text-amber-800",
    Icon: IconClock,
  },
  approved: {
    label: "Approved",
    pill: "border-accent/25 bg-accent-soft text-accent",
    Icon: IconCheckCircle,
  },
  rejected: {
    label: "Rejected",
    pill: "border-rose-200/80 bg-rose-50 text-rose-700",
    Icon: IconXCircle,
  },
};

function formatApplied(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function isThisMonth(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function AdminEnrollmentsPanel() {
  const [rows, setRows] = useState<CourseEnrollment[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/course-enrollments", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Could not load enrollments");
      const data = (await res.json()) as CourseEnrollment[];
      setRows(Array.isArray(data) ? data : []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (filterRef.current && !filterRef.current.contains(t)) {
        setFilterOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(t)) {
        setMenuId(null);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((r) => (r.status || "pending") === "pending")
      .length;
    const approvedMonth = rows.filter(
      (r) => r.status === "approved" && isThisMonth(r.createdAt)
    ).length;
    const rejectedMonth = rows.filter(
      (r) => r.status === "rejected" && isThisMonth(r.createdAt)
    ).length;
    return { total, pending, approvedMonth, rejectedMonth };
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((a) => {
      const st = a.status || "pending";
      if (statusFilter !== "all" && st !== statusFilter) return false;
      if (!q) return true;
      return [a.name, a.phone, a.email ?? "", a.city ?? "", a.courseTitle]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [rows, query, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, pageSize]);

  async function setStatus(id: string, status: CourseEnrollmentStatus) {
    setBusy(true);
    setMenuId(null);
    try {
      const res = await fetch("/api/admin/course-enrollments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = (await res.json()) as CourseEnrollment;
      setRows((list) => list.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Delete enrollment from "${name}"?`)) return;
    setBusy(true);
    setMenuId(null);
    try {
      const res = await fetch("/api/admin/course-enrollments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setRows((list) => list.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  const showingFrom =
    filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const showingTo = Math.min(safePage * pageSize, filtered.length);

  const pageButtons = useMemo(() => {
    const max = pageCount;
    const cur = safePage;
    if (max <= 5) return Array.from({ length: max }, (_, i) => i + 1);
    const set = new Set([1, max, cur, cur - 1, cur + 1].filter((n) => n >= 1 && n <= max));
    return [...set].sort((a, b) => a - b);
  }, [pageCount, safePage]);

  return (
    <div className="mt-7 space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg shadow-soft">
            <IconCourse className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl text-ink sm:text-[1.65rem]">
              Course Applications
            </h2>
            <p className="mt-1 max-w-md text-sm text-muted">
              Manage and review course applications submitted by users
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
          <label className="relative min-w-0 flex-1 sm:min-w-[240px]">
            <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="console-field pl-10"
            />
          </label>
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterOpen((o) => !o)}
              className="console-btn-soft inline-flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              <IconFilter className="h-4 w-4" />
              Filter
              {statusFilter !== "all" ? (
                <span className="rounded-full bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                  {statusFilter}
                </span>
              ) : null}
            </button>
            {filterOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-lift-lg">
                {(
                  [
                    ["all", "All statuses"],
                    ["pending", "Pending"],
                    ["approved", "Approved"],
                    ["rejected", "Rejected"],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setStatusFilter(val);
                      setFilterOpen(false);
                    }}
                    className={`flex w-full px-3.5 py-2 text-left text-sm transition ${
                      statusFilter === val
                        ? "bg-accent-soft font-medium text-accent"
                        : "text-ink-soft hover:bg-canvas hover:text-ink"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatMini
          icon={<IconUsers className="h-4 w-4" />}
          iconClass="bg-accent-soft text-accent"
          value={stats.total}
          label="Total Applications"
          sub="All time"
        />
        <StatMini
          icon={<IconClock className="h-4 w-4" />}
          iconClass="bg-amber-50 text-amber-600"
          value={stats.pending}
          label="Pending Review"
          sub="Awaiting action"
        />
        <StatMini
          icon={<IconCheckCircle className="h-4 w-4" />}
          iconClass="bg-accent-soft text-accent"
          value={stats.approvedMonth}
          label="Approved"
          sub="This month"
        />
        <StatMini
          icon={<IconXCircle className="h-4 w-4" />}
          iconClass="bg-rose-50 text-rose-600"
          value={stats.rejectedMonth}
          label="Rejected"
          sub="This month"
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {!loaded ? (
          <div className="console-card px-6 py-12 text-center text-sm text-muted">
            Loading…
          </div>
        ) : pageRows.length === 0 ? (
          <div className="console-card px-6 py-12 text-center text-sm text-muted">
            {rows.length === 0
              ? "No applications yet — they appear when someone enrolls on a course page."
              : "No match for this search or filter."}
          </div>
        ) : (
          pageRows.map((a) => {
            const st = (a.status || "pending") as CourseEnrollmentStatus;
            const meta = STATUS_META[st];
            const StatusIcon = meta.Icon;
            return (
              <article
                key={a.id}
                className="console-card relative overflow-visible p-4 sm:p-5"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  {/* Student */}
                  <div className="flex min-w-0 flex-1 gap-3.5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-sm font-semibold text-accent">
                      {initials(a.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">{a.name}</p>
                      <p className="mt-1.5 flex items-center gap-2 text-sm text-ink-soft">
                        <IconPhone className="h-3.5 w-3.5 shrink-0 text-muted" />
                        <a
                          href={`tel:${a.phone.replace(/\s/g, "")}`}
                          className="hover:text-accent"
                        >
                          {a.phone}
                        </a>
                      </p>
                      {a.email ? (
                        <p className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
                          <IconMail className="h-3.5 w-3.5 shrink-0 text-muted" />
                          <a
                            href={`mailto:${a.email}`}
                            className="truncate hover:text-accent"
                          >
                            {a.email}
                          </a>
                        </p>
                      ) : null}
                      <p className="mt-2.5 flex items-center gap-1.5 text-xs text-accent">
                        <IconCalendar className="h-3.5 w-3.5 shrink-0" />
                        Applied on: {formatApplied(a.createdAt)}
                      </p>
                      {a.message ? (
                        <p className="mt-2 line-clamp-2 text-xs text-muted">
                          {a.message}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Course */}
                  <div className="min-w-0 flex-1 border-t border-line pt-4 lg:border-l lg:border-t-0 lg:px-6 lg:pt-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                      Course
                    </p>
                    <p className="mt-1.5 font-semibold text-ink">
                      {a.courseTitle}
                    </p>
                    {a.courseDuration ? (
                      <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
                        <IconClock className="h-3.5 w-3.5 shrink-0 text-muted" />
                        Duration: {a.courseDuration}
                      </p>
                    ) : null}
                    {a.coursePrice ? (
                      <p className="mt-1.5 flex items-center gap-2 text-sm text-ink-soft">
                        <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-[10px] font-bold text-muted">
                          ₨
                        </span>
                        Fee: {a.coursePrice}
                      </p>
                    ) : null}
                    {a.city ? (
                      <p className="mt-1.5 text-xs text-muted">City: {a.city}</p>
                    ) : null}
                  </div>

                  {/* Status + menu */}
                  <div className="flex items-start justify-between gap-3 border-t border-line pt-4 lg:w-44 lg:shrink-0 lg:flex-col lg:items-end lg:border-0 lg:pt-0">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${meta.pill}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {meta.label}
                    </span>

                    <div className="relative" ref={menuId === a.id ? menuRef : undefined}>
                      <button
                        type="button"
                        disabled={busy}
                        aria-label="Actions"
                        onClick={() =>
                          setMenuId((id) => (id === a.id ? null : a.id))
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-accent/40 hover:text-accent"
                      >
                        <IconMoreVertical className="h-4 w-4" />
                      </button>
                      {menuId === a.id ? (
                        <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-lift-lg">
                          {st !== "approved" ? (
                            <button
                              type="button"
                              className="flex w-full px-3.5 py-2 text-left text-sm text-ink-soft hover:bg-accent-soft hover:text-accent"
                              onClick={() => void setStatus(a.id, "approved")}
                            >
                              Approve
                            </button>
                          ) : null}
                          {st !== "pending" ? (
                            <button
                              type="button"
                              className="flex w-full px-3.5 py-2 text-left text-sm text-ink-soft hover:bg-canvas hover:text-ink"
                              onClick={() => void setStatus(a.id, "pending")}
                            >
                              Mark pending
                            </button>
                          ) : null}
                          {st !== "rejected" ? (
                            <button
                              type="button"
                              className="flex w-full px-3.5 py-2 text-left text-sm text-ink-soft hover:bg-rose-50 hover:text-rose-700"
                              onClick={() => void setStatus(a.id, "rejected")}
                            >
                              Reject
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="flex w-full border-t border-line px-3.5 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                            onClick={() => void remove(a.id, a.name)}
                          >
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {loaded && filtered.length > 0 ? (
        <div className="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            Showing {showingFrom} to {showingTo} of {filtered.length} results
          </p>

          <div className="flex items-center justify-center gap-1">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-soft disabled:opacity-40"
              aria-label="Previous page"
            >
              <IconChevronLeft className="h-4 w-4" />
            </button>
            {pageButtons.map((n, i) => {
              const prev = pageButtons[i - 1];
              const gap = prev != null && n - prev > 1;
              return (
                <span key={n} className="contents">
                  {gap ? (
                    <span className="px-1 text-xs text-muted">…</span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setPage(n)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                      n === safePage
                        ? "bg-accent text-accent-fg shadow-soft"
                        : "border border-line text-ink-soft hover:border-accent/40 hover:text-accent"
                    }`}
                  >
                    {n}
                  </button>
                </span>
              );
            })}
            <button
              type="button"
              disabled={safePage >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-soft disabled:opacity-40"
              aria-label="Next page"
            >
              <IconChevronRight className="h-4 w-4" />
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-muted sm:justify-end">
            <select
              value={pageSize}
              onChange={(e) =>
                setPageSize(Number(e.target.value) as (typeof PAGE_SIZES)[number])
              }
              className="console-field cursor-pointer py-1.5 text-xs"
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>
                  {n} per page
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      {error ? (
        <p className="text-sm text-rose-600">{error}</p>
      ) : null}
    </div>
  );
}

function StatMini({
  icon,
  iconClass,
  value,
  label,
  sub,
}: {
  icon: ReactNode;
  iconClass: string;
  value: number;
  label: string;
  sub: string;
}) {
  return (
    <div className="console-card relative overflow-hidden border-l-[3px] border-l-accent p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            {label}
          </p>
          <p className="mt-1.5 font-display text-3xl text-ink">{value}</p>
          <p className="mt-1 text-xs text-muted">{sub}</p>
        </div>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClass}`}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}
