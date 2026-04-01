import { NextResponse } from "next/server";
import { addBooking, getBookings } from "@/lib/bookings-store";
import { validateBookingBody } from "@/lib/booking-validation";
import { clientIpFromRequest, rateLimitBooking } from "@/lib/rate-limit";
import { lookupServicePriceLabel } from "@/lib/service-pricing-lookup";
import {
  adminCookieName,
  verifySessionToken,
} from "@/lib/admin-session";
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

  const { name, email, phone, service, date, time, message } = checked.data;
  try {
    const booking = await addBooking({
      name,
      email,
      phone,
      service,
      priceLabel: lookupServicePriceLabel(service),
      date,
      time,
      message,
    });
    return NextResponse.json({ ok: true, id: booking.id });
  } catch (err) {
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
