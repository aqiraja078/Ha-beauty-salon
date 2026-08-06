import { NextResponse } from "next/server";
import {
  addBooking,
  getBookings,
  SlotConflictError,
} from "@/lib/bookings-store";
import { isDateBlocked } from "@/lib/blocked-dates-store";
import { validateBookingBody } from "@/lib/booking-validation";
import { clientIpFromRequest, rateLimitBooking } from "@/lib/rate-limit";
import { lookupCmsServicePrice } from "@/lib/content-store";
import { formatFromPrice } from "@/lib/format-price";
import {
  adminCookieName,
  verifySessionToken,
} from "@/lib/admin-session";
import { notifyAdminOfNewBooking } from "@/lib/booking-status-notifications";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const ip = clientIpFromRequest(request);
  const limited = rateLimitBooking(`booking:${ip}`);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many booking requests. Please try again in a few minutes." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    );
  }

  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const checked = validateBookingBody(parsed);
  if (!checked.ok) {
    return NextResponse.json({ error: checked.error }, { status: checked.status });
  }

  const {
    name,
    email,
    phone,
    service,
    date,
    time,
    message,
    price,
    area,
    bookingMode,
    services,
    durationMinutes,
    travelMinutes,
  } = checked.data;

  if (await isDateBlocked(date)) {
    return NextResponse.json(
      { error: "That date is not available for booking. Please choose another day." },
      { status: 400 }
    );
  }

  try {
    let priceLabel: string | undefined;
    if (price) {
      priceLabel = formatFromPrice(price);
    } else if (bookingMode === "single" && services[0]) {
      priceLabel = formatFromPrice(await lookupCmsServicePrice(services[0]));
    }

    const booking = await addBooking({
      name,
      email,
      phone,
      service,
      priceLabel,
      date,
      time,
      message,
      area,
      bookingMode,
      services,
      durationMinutes,
      travelMinutes,
    });
    void notifyAdminOfNewBooking(booking).catch((err) => {
      console.error(
        "[notify] admin email failed:",
        err instanceof Error ? err.message : String(err)
      );
    });
    return NextResponse.json({ ok: true, id: booking.id });
  } catch (err) {
    if (err instanceof SlotConflictError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Booking save failed:", err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: "Could not save booking." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const jar = await cookies();
  const token = jar.get(adminCookieName)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const bookings = await getBookings();
  return NextResponse.json(bookings);
}
