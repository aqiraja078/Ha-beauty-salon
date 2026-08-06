import type { Booking, BookingArea, BookingStatus } from "@/lib/bookings-types";
import {
  bookingAreaLabel,
  countsTowardSales,
} from "@/lib/bookings-types";
import { parsePriceAmount } from "@/lib/format-price";
import { site } from "@/lib/site";

/** Guest WhatsApp when admin confirms. */
export function buildConfirmWhatsAppMessage(
  booking: Booking,
  salonName: string = site.name
): string {
  const area = bookingAreaLabel(booking.area);
  const lines = [
    `Assalam o Alaikum ${booking.name},`,
    ``,
    `Your booking with ${salonName} is confirmed ✓`,
    ``,
    `Service: ${booking.service}`,
    `Date: ${booking.date}`,
    `Time: ${booking.time}`,
    `Area: ${area}`,
    booking.priceLabel ? `Price from: ${booking.priceLabel}` : null,
    booking.depositPaid != null && booking.depositPaid > 0
      ? `Advance received: Rs. ${booking.depositPaid.toLocaleString("en-PK")}`
      : null,
    ``,
    `We will see you then. Thank you!`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

export function guestWhatsAppUrl(booking: Booking, salonName?: string): string {
  const digits = booking.phone.replace(/\D/g, "");
  let wa = digits;
  if (wa.startsWith("0") && wa.length === 11) wa = `92${wa.slice(1)}`;
  if (wa.length < 10) return "";
  const text = buildConfirmWhatsAppMessage(booking, salonName ?? site.name);
  return `https://wa.me/${wa}?text=${encodeURIComponent(text)}`;
}

export function normalizePhoneKey(phone: string): string {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("92") && d.length >= 12) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  return d;
}

export function clientHistory(
  bookings: Booking[],
  current: Booking
): Booking[] {
  const phoneKey = normalizePhoneKey(current.phone);
  const email = current.email.trim().toLowerCase();
  return bookings
    .filter((b) => b.id !== current.id)
    .filter((b) => {
      const samePhone =
        phoneKey.length >= 9 &&
        normalizePhoneKey(b.phone) === phoneKey;
      const sameEmail =
        Boolean(email) && b.email.trim().toLowerCase() === email;
      return samePhone || sameEmail;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function balanceDue(booking: Booking): number | null {
  const total = parsePriceAmount(booking.priceLabel);
  if (total == null) return null;
  const paid = booking.depositPaid ?? 0;
  return Math.max(0, total - paid);
}

export type ServiceSalesRow = {
  service: string;
  amount: number;
  count: number;
};

export function salesByService(
  bookings: Booking[],
  opts?: { year?: number; month?: number; area?: BookingArea | "all" }
): ServiceSalesRow[] {
  const map = new Map<string, { amount: number; count: number }>();
  for (const b of bookings) {
    if (!countsTowardSales(b.status)) continue;
    const y = Number(b.date?.slice(0, 4));
    const m = Number(b.date?.slice(5, 7));
    if (opts?.year != null && y !== opts.year) continue;
    if (opts?.month != null && m !== opts.month) continue;
    if (opts?.area && opts.area !== "all" && b.area !== opts.area) continue;
    const amount = parsePriceAmount(b.priceLabel) ?? 0;
    const key = b.service || "Unknown";
    const cur = map.get(key) ?? { amount: 0, count: 0 };
    cur.amount += amount;
    cur.count += 1;
    map.set(key, cur);
  }
  return Array.from(map.entries())
    .map(([service, v]) => ({ service, amount: v.amount, count: v.count }))
    .sort((a, b) => b.amount - a.amount);
}

export function bookingsToCsv(bookings: Booking[]): string {
  const headers = [
    "Ref",
    "Status",
    "Name",
    "Phone",
    "Email",
    "Service",
    "Area",
    "Date",
    "Time",
    "Price",
    "Deposit",
    "Balance",
    "Created",
  ];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = bookings.map((b) => {
    const total = parsePriceAmount(b.priceLabel);
    const deposit = b.depositPaid ?? 0;
    const bal =
      total != null ? Math.max(0, total - deposit).toString() : "";
    return [
      b.id.replace(/-/g, "").slice(-6).toUpperCase(),
      b.status,
      b.name,
      b.phone,
      b.email,
      b.service,
      bookingAreaLabel(b.area),
      b.date,
      b.time,
      b.priceLabel ?? "",
      deposit ? String(deposit) : "",
      bal,
      b.createdAt,
    ]
      .map((c) => escape(String(c)))
      .join(",");
  });
  return [headers.join(","), ...rows].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function statusLabel(status: BookingStatus): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "completed":
      return "Completed";
    case "no_show":
      return "No-show";
    case "cancelled":
      return "Cancelled";
  }
}
