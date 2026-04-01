import type { Booking, BookingStatus } from "@/lib/bookings-types";
import { site } from "@/lib/site";

/**
 * When admin sets a booking to confirmed or cancelled, optionally email the guest.
 * Uses Resend: RESEND_API_KEY + NOTIFY_EMAIL_FROM (see .env.example).
 * If unset, the booking update still succeeds — email is skipped.
 */

function statusVerb(status: BookingStatus): string {
  if (status === "confirmed") return "confirmed";
  if (status === "cancelled") return "cancelled";
  return status;
}

function emailSubject(status: BookingStatus): string {
  if (status === "confirmed") return `Appointment confirmed — ${site.name}`;
  if (status === "cancelled") return `Appointment update — ${site.name}`;
  return `Booking update — ${site.name}`;
}

function emailHtml(booking: Booking, status: BookingStatus): string {
  const v = statusVerb(status);
  const intro =
    status === "confirmed"
      ? "Good news — your appointment is <strong>confirmed</strong>."
      : status === "cancelled"
        ? "Your appointment request has been <strong>cancelled</strong>."
        : `Your booking status is now <strong>${v}</strong>.`;

  return `
<!DOCTYPE html>
<html>
<body style="font-family: Georgia, serif; line-height: 1.6; color: #111; max-width: 560px;">
  <p>${intro}</p>
  <table style="border-collapse: collapse; margin: 16px 0;">
    <tr><td style="padding: 4px 12px 4px 0; color: #666;">Name</td><td>${escapeHtml(booking.name)}</td></tr>
    <tr><td style="padding: 4px 12px 4px 0; color: #666;">Service</td><td>${escapeHtml(booking.service)}</td></tr>
    <tr><td style="padding: 4px 12px 4px 0; color: #666;">Date</td><td>${escapeHtml(booking.date)}</td></tr>
    <tr><td style="padding: 4px 12px 4px 0; color: #666;">Time</td><td>${escapeHtml(booking.time)}</td></tr>
    <tr><td style="padding: 4px 12px 4px 0; color: #666;">Status</td><td style="text-transform: capitalize;">${escapeHtml(booking.status)}</td></tr>
  </table>
  <p style="font-size: 14px; color: #555;">${escapeHtml(site.name)}<br/>
  ${escapeHtml(site.phone)} · ${escapeHtml(site.email)}</p>
</body>
</html>`;
}

function emailText(booking: Booking, status: BookingStatus): string {
  return `${statusVerb(status).toUpperCase()} — ${site.name}\n\n${booking.name}\n${booking.service}\n${booking.date} at ${booking.time}\n\n${site.phone} | ${site.email}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendWithResend(
  to: string,
  subject: string,
  html: string,
  text: string
) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.NOTIFY_EMAIL_FROM?.trim();
  if (!apiKey || !from) return;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("[notify] Resend failed:", res.status, err);
  }
}

export async function notifyGuestOfBookingStatus(
  booking: Booking,
  previousStatus: BookingStatus
): Promise<void> {
  if (previousStatus === booking.status) return;
  if (booking.status !== "confirmed" && booking.status !== "cancelled") return;

  const subject = emailSubject(booking.status);
  const html = emailHtml(booking, booking.status);
  const text = emailText(booking, booking.status);

  await sendWithResend(booking.email.trim(), subject, html, text);
}
