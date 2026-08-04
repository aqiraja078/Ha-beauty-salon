import type { BookingArea, BookingMode } from "@/lib/bookings-types";
import { isBookingTimeSlot } from "@/lib/booking-slots";

/** Shared limits for booking API + client form (DoS / oversize payload guard). */
export const BOOKING_FIELD_LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  service: 400,
  message: 2000,
  servicesMax: 12,
  serviceItem: 200,
} as const;

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/** Pakistan mobile: 03XXXXXXXXX (11 digits). */
const PK_MOBILE_LOCAL_RE = /^03[0-9]{9}$/;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const AREAS = new Set<BookingArea>(["jhelum", "dina", "gujrat"]);
const MODES = new Set<BookingMode>(["single", "bridal"]);

function stripControls(s: string): string {
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

function clamp(s: string, max: number): string {
  return stripControls(s).trim().slice(0, max);
}

export function isValidBookingEmail(email: string): boolean {
  const e = email.trim();
  return Boolean(e) && e.length <= BOOKING_FIELD_LIMITS.email && EMAIL_RE.test(e);
}

/** Digits only, normalized toward local 03XXXXXXXXX. */
export function normalizePkMobileDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0092")) digits = digits.slice(4);
  else if (digits.startsWith("92") && digits.length >= 12) {
    digits = digits.slice(2);
  }
  if (digits.length === 10 && digits.startsWith("3")) digits = `0${digits}`;
  return digits;
}

export function isValidPkMobile(raw: string): boolean {
  return PK_MOBILE_LOCAL_RE.test(normalizePkMobileDigits(raw));
}

/** Display as 03XX XXXXXXX */
export function formatPkMobileDisplay(raw: string): string {
  const d = normalizePkMobileDigits(raw).slice(0, 11);
  if (d.length <= 4) return d;
  return `${d.slice(0, 4)} ${d.slice(4)}`;
}

export function emailValidationMessage(email: string): string | null {
  const e = email.trim();
  if (!e) return "Email is required.";
  if (!isValidBookingEmail(e)) {
    return "Enter a valid email (e.g. name@gmail.com).";
  }
  return null;
}

export function phoneValidationMessage(phone: string): string | null {
  const p = phone.trim();
  if (!p) return "Phone number is required.";
  if (!isValidPkMobile(p)) {
    return "Enter a valid Pakistani mobile (e.g. 0300 1234567).";
  }
  return null;
}

export type ValidatedBookingInput = {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message?: string;
  /** Optional display price from length-aware menu cards. */
  price?: string;
  area: BookingArea;
  bookingMode: BookingMode;
  services: string[];
  durationMinutes: number;
  travelMinutes: number;
};

export function validateBookingBody(body: unknown):
  | { ok: true; data: ValidatedBookingInput }
  | { ok: false; error: string; status: number } {
  if (body === null || typeof body !== "object") {
    return { ok: false, error: "Invalid JSON body.", status: 400 };
  }
  const b = body as Record<string, unknown>;
  const name = clamp(String(b.name ?? ""), BOOKING_FIELD_LIMITS.name);
  const email = clamp(String(b.email ?? ""), BOOKING_FIELD_LIMITS.email).toLowerCase();
  const phoneRaw = clamp(String(b.phone ?? ""), BOOKING_FIELD_LIMITS.phone);
  const date = clamp(String(b.date ?? ""), 32);
  const time = clamp(String(b.time ?? ""), 8);
  const messageRaw = b.message;
  const message =
    messageRaw === undefined || messageRaw === null || messageRaw === ""
      ? undefined
      : clamp(String(messageRaw), BOOKING_FIELD_LIMITS.message);
  const priceRaw = b.price;
  const price =
    priceRaw === undefined || priceRaw === null || priceRaw === ""
      ? undefined
      : clamp(String(priceRaw), 40);

  const areaRaw = clamp(String(b.area ?? ""), 16).toLowerCase() as BookingArea;
  const modeRaw = clamp(
    String(b.bookingMode ?? "single"),
    16
  ).toLowerCase() as BookingMode;

  let services: string[] = [];
  if (Array.isArray(b.services)) {
    services = b.services
      .map((s) => clamp(String(s ?? ""), BOOKING_FIELD_LIMITS.serviceItem))
      .filter(Boolean)
      .slice(0, BOOKING_FIELD_LIMITS.servicesMax);
  }

  const serviceFallback = clamp(
    String(b.service ?? ""),
    BOOKING_FIELD_LIMITS.service
  );
  if (!services.length && serviceFallback) {
    services = [serviceFallback];
  }

  const durationRaw = Number(b.durationMinutes);
  const travelRaw = Number(b.travelMinutes);
  const durationMinutes =
    Number.isFinite(durationRaw) && durationRaw > 0 && durationRaw <= 720
      ? Math.round(durationRaw)
      : 60;
  const travelMinutes =
    Number.isFinite(travelRaw) && travelRaw >= 0 && travelRaw <= 180
      ? Math.round(travelRaw)
      : 20;

  if (!name) {
    return { ok: false, error: "Name is required.", status: 400 };
  }
  const emailErr = emailValidationMessage(email);
  if (emailErr) {
    return { ok: false, error: emailErr, status: 400 };
  }
  const phoneErr = phoneValidationMessage(phoneRaw);
  if (phoneErr) {
    return { ok: false, error: phoneErr, status: 400 };
  }
  const phone = formatPkMobileDisplay(phoneRaw);

  if (!AREAS.has(areaRaw)) {
    return {
      ok: false,
      error: "Please choose an area (Jhelum, Dina, or Gujrat).",
      status: 400,
    };
  }
  if (!MODES.has(modeRaw)) {
    return { ok: false, error: "Invalid booking mode.", status: 400 };
  }
  if (!services.length) {
    return { ok: false, error: "Service is required.", status: 400 };
  }
  if (modeRaw === "bridal" && services.length < 2) {
    return {
      ok: false,
      error: "Multi service needs at least two services.",
      status: 400,
    };
  }

  const service =
    modeRaw === "bridal"
      ? clamp(
          `Multi service: ${services.join(" + ")}`,
          BOOKING_FIELD_LIMITS.service
        )
      : clamp(services[0], BOOKING_FIELD_LIMITS.service);

  if (!date || !DATE_RE.test(date)) {
    return { ok: false, error: "Please choose a valid date.", status: 400 };
  }
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { ok: false, error: "Please choose a valid date.", status: 400 };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsed < today) {
    return { ok: false, error: "Date cannot be in the past.", status: 400 };
  }
  const max = new Date();
  max.setFullYear(max.getFullYear() + 2);
  if (parsed > max) {
    return { ok: false, error: "Please choose a date within the next two years.", status: 400 };
  }
  if (!time || !isBookingTimeSlot(time)) {
    return { ok: false, error: "Please choose a valid time.", status: 400 };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      phone,
      service,
      date,
      time,
      message,
      price,
      area: areaRaw,
      bookingMode: modeRaw,
      services,
      durationMinutes,
      travelMinutes,
    },
  };
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isBookingId(id: string): boolean {
  return UUID_RE.test(id.trim());
}
