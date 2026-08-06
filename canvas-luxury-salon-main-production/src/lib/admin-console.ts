import type { Booking, BookingStatus } from "@/lib/bookings-types";
import { countsTowardSales } from "@/lib/bookings-types";
import { parsePriceAmount } from "@/lib/format-price";

/** Short, human-quotable reference derived from the booking id. */
export function bookingRef(id: string) {
  return id.replace(/-/g, "").slice(-6).toUpperCase();
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export type StatusTone = {
  label: string;
  pill: string;
  dot: string;
  iconWrap: string;
  bar: string;
};

export const STATUS_TONES: Record<BookingStatus, StatusTone> = {
  pending: {
    label: "Pending",
    pill: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    iconWrap: "bg-amber-50 text-amber-500",
    bar: "from-amber-300 to-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    pill: "border-accent/30 bg-accent-soft text-accent",
    dot: "bg-accent",
    iconWrap: "bg-accent-soft text-accent",
    bar: "from-tint to-accent-strong",
  },
  completed: {
    label: "Completed",
    pill: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-600",
    iconWrap: "bg-emerald-50 text-emerald-700",
    bar: "from-emerald-400 to-emerald-700",
  },
  no_show: {
    label: "No-show",
    pill: "border-orange-200 bg-orange-50 text-orange-800",
    dot: "bg-orange-500",
    iconWrap: "bg-orange-50 text-orange-600",
    bar: "from-orange-300 to-orange-500",
  },
  cancelled: {
    label: "Cancelled",
    pill: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
    iconWrap: "bg-rose-50 text-rose-500",
    bar: "from-rose-300 to-rose-500",
  },
};

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Submissions per day for the last `days` days, oldest first — feeds the sparklines. */
export function dailySeries(
  bookings: Booking[],
  days = 7,
  status?: BookingStatus
): number[] {
  const buckets = new Map<string, number>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.set(dayKey(d), 0);
  }

  for (const b of bookings) {
    if (status && b.status !== status) continue;
    const key = dayKey(new Date(b.createdAt));
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return Array.from(buckets.values());
}

/** How many of these bookings arrived today. */
export function countToday(bookings: Booking[], status?: BookingStatus) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const key = dayKey(today);
  return bookings.filter(
    (b) =>
      (!status || b.status === status) && dayKey(new Date(b.createdAt)) === key
  ).length;
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export function formatDay(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Format PKR for dashboard sales tiles. */
export function formatSalesPkr(amount: number) {
  return `Rs. ${Math.round(amount).toLocaleString("en-PK")}`;
}

export type SalesPeriodSummary = {
  amount: number;
  count: number;
  labeled: string;
};

/**
 * Sum menu “from” prices for completed (Done) bookings in a calendar period
 * (by appointment date YYYY-MM-DD).
 */
export function confirmedSales(
  bookings: Booking[],
  opts: { year: number; month?: number }
): SalesPeriodSummary {
  let amount = 0;
  let count = 0;
  for (const b of bookings) {
    if (!countsTowardSales(b.status)) continue;
    const y = Number(b.date?.slice(0, 4));
    const m = Number(b.date?.slice(5, 7));
    if (y !== opts.year) continue;
    if (opts.month != null && m !== opts.month) continue;
    const n = parsePriceAmount(b.priceLabel);
    if (n == null) continue;
    amount += n;
    count += 1;
  }
  return { amount, count, labeled: formatSalesPkr(amount) };
}

/** Sparkline of confirmed sales totals for the last `months` calendar months. */
export function monthlySalesSeries(bookings: Booking[], months = 6): number[] {
  const now = new Date();
  const series: number[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    series.push(
      confirmedSales(bookings, {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
      }).amount
    );
  }
  return series;
}
