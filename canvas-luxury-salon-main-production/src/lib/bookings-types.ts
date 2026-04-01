export type BookingStatus = "pending" | "confirmed" | "cancelled";

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
};
