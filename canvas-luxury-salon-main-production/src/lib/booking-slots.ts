/** Shared bookable time slots (24h HH:mm) — 9 AM to 8 PM. */
export const BOOKING_TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
] as const;

export type BookingTimeSlot = (typeof BOOKING_TIME_SLOTS)[number];

export function isBookingTimeSlot(time: string): time is BookingTimeSlot {
  return (BOOKING_TIME_SLOTS as readonly string[]).includes(time);
}
