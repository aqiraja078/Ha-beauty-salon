export type BookingStatus = "pending" | "confirmed" | "cancelled";

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
};

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
