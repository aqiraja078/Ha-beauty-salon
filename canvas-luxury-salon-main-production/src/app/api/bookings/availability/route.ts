import { NextResponse } from "next/server";
import { getTakenTimesForDate } from "@/lib/bookings-store";
import { isDateBlocked } from "@/lib/blocked-dates-store";
import { BOOKING_TIME_SLOTS } from "@/lib/booking-slots";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = (searchParams.get("date") || "").trim();
  if (!date || !DATE_RE.test(date)) {
    return NextResponse.json(
      { error: "Query param date=YYYY-MM-DD is required." },
      { status: 400 }
    );
  }

  const [taken, blocked] = await Promise.all([
    getTakenTimesForDate(date),
    isDateBlocked(date),
  ]);

  return NextResponse.json({
    date,
    slots: BOOKING_TIME_SLOTS,
    taken: blocked ? [...BOOKING_TIME_SLOTS] : taken,
    blocked,
  });
}
