export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "no_show"
  | "cancelled";

export type BookingArea = "jhelum" | "dina" | "gujrat";

export type BookingMode = "single" | "bridal";

export type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  /** List / menu price hint at time of booking (for admin). */
  priceLabel?: string;
  date: string;
  time: string;
  message?: string;
  status: BookingStatus;
  createdAt: string;
  /** Home-service area (optional for legacy bookings). */
  area?: BookingArea;
  bookingMode?: BookingMode;
  /** Individual services; bridal packages use multiple. */
  services?: string[];
  /** Estimated service duration in minutes. */
  durationMinutes?: number;
  /** Estimated travel time in minutes for the selected area. */
  travelMinutes?: number;
  /** Advance / deposit paid (PKR). */
  depositPaid?: number;
  /** Optional note about deposit (cash, JazzCash, etc.). */
  depositNote?: string;
};

export const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "no_show",
  "cancelled",
];

export function isBookingStatus(v: string): v is BookingStatus {
  return (BOOKING_STATUSES as string[]).includes(v);
}

/** Statuses that still hold a calendar slot. */
export function holdsBookingSlot(status: BookingStatus): boolean {
  return status === "pending" || status === "confirmed";
}

/** Statuses that count toward sales totals (admin marked Done). */
export function countsTowardSales(status: BookingStatus): boolean {
  return status === "completed";
}

export const BOOKING_AREAS: {
  id: BookingArea;
  label: string;
  travelMinutes: number;
}[] = [
  { id: "jhelum", label: "Jhelum", travelMinutes: 20 },
  { id: "dina", label: "Dina", travelMinutes: 35 },
  { id: "gujrat", label: "Gujrat", travelMinutes: 50 },
];

export function bookingAreaLabel(area?: BookingArea): string {
  if (!area) return "—";
  return BOOKING_AREAS.find((a) => a.id === area)?.label ?? area;
}
