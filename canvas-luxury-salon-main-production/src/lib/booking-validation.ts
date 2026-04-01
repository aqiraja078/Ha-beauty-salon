/** Shared limits for booking API + client form (DoS / oversize payload guard). */
export const BOOKING_FIELD_LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  service: 200,
  message: 2000,
} as const;

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function stripControls(s: string): string {
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

function clamp(s: string, max: number): string {
  return stripControls(s).trim().slice(0, max);
}

export type ValidatedBookingInput = {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message?: string;
};

export function validateBookingBody(body: unknown):
  | { ok: true; data: ValidatedBookingInput }
  | { ok: false; error: string; status: number } {
  if (body === null || typeof body !== "object") {
    return { ok: false, error: "Invalid JSON body.", status: 400 };
  }
  const b = body as Record<string, unknown>;
  const name = clamp(String(b.name ?? ""), BOOKING_FIELD_LIMITS.name);
  const email = clamp(String(b.email ?? ""), BOOKING_FIELD_LIMITS.email);
  const phone = clamp(String(b.phone ?? ""), BOOKING_FIELD_LIMITS.phone);
  const service = clamp(String(b.service ?? ""), BOOKING_FIELD_LIMITS.service);
  const date = clamp(String(b.date ?? ""), 32);
  const time = clamp(String(b.time ?? ""), 8);
  const messageRaw = b.message;
  const message =
    messageRaw === undefined || messageRaw === null || messageRaw === ""
      ? undefined
      : clamp(String(messageRaw), BOOKING_FIELD_LIMITS.message);

  if (!name) {
    return { ok: false, error: "Name is required.", status: 400 };
  }
  if (!email) {
    return { ok: false, error: "Email is required.", status: 400 };
  }
  if (!EMAIL_RE.test(email) || email.length > BOOKING_FIELD_LIMITS.email) {
    return { ok: false, error: "Please enter a valid email address.", status: 400 };
  }
  if (!phone) {
    return { ok: false, error: "Phone is required.", status: 400 };
  }
  if (!service) {
    return { ok: false, error: "Service is required.", status: 400 };
  }
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
  if (!time || !TIME_RE.test(time)) {
    return { ok: false, error: "Please choose a valid time.", status: 400 };
  }

  return {
    ok: true,
    data: { name, email, phone, service, date, time, message },
  };
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isBookingId(id: string): boolean {
  return UUID_RE.test(id.trim());
}
