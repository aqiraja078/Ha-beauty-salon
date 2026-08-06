import { bookingAreaLabel, type BookingArea, type BookingMode } from "@/lib/bookings-types";
import { whatsappBookUrl } from "@/lib/site";

export type BookingWhatsAppPayload = {
  name: string;
  phone: string;
  email?: string;
  area: BookingArea;
  services: string[];
  serviceLabel: string;
  date: string;
  time: string;
  durationMinutes: number;
  travelMinutes: number;
  bookingMode: BookingMode;
  message?: string;
  priceLabel?: string;
};

export function buildBookingWhatsAppMessage(
  payload: BookingWhatsAppPayload,
  salonName: string
): string {
  const area = bookingAreaLabel(payload.area);
  const lines = [
    `Assalam o Alaikum ${salonName},`,
    ``,
    `I would like to confirm my booking request:`,
    ``,
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    payload.email ? `Email: ${payload.email}` : null,
    `Area: ${area}`,
    `Mode: ${payload.bookingMode === "bridal" ? "Multi service" : "Single service"}`,
    `Service: ${payload.serviceLabel}`,
    payload.services.length > 1
      ? `Includes: ${payload.services.join(", ")}`
      : null,
    `Date: ${payload.date}`,
    `Time: ${payload.time}`,
    payload.priceLabel ? `Price from: ${payload.priceLabel}` : null,
    payload.message ? `Notes: ${payload.message}` : null,
    ``,
    `Please confirm. Thank you!`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

export function bookingWhatsAppUrl(
  payload: BookingWhatsAppPayload,
  identity: { name: string; phoneDigits: string }
): string {
  const text = buildBookingWhatsAppMessage(payload, identity.name);
  return `https://wa.me/${identity.phoneDigits}?text=${encodeURIComponent(text)}`;
}

/** Generic book link (sticky bar / FAB). */
export function salonWhatsAppBookUrl(identity?: {
  name: string;
  phoneDigits: string;
}): string {
  return whatsappBookUrl(undefined, identity);
}
