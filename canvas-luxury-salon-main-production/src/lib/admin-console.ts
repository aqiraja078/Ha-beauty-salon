import type { Booking, BookingStatus } from "@/lib/bookings-types";

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
