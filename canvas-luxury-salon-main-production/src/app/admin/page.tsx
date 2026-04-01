import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  adminCookieName,
  verifySessionToken,
} from "@/lib/admin-session";
import { getBookings, type Booking } from "@/lib/bookings-store";
import { AdminBookingsClient } from "./AdminBookingsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const jar = await cookies();
  if (!verifySessionToken(jar.get(adminCookieName)?.value)) {
    redirect("/admin/login");
  }

  let bookings: Booking[] = [];
  try {
    bookings = await getBookings();
  } catch (error) {
    console.error("Failed to load bookings:", error);
    // Return empty array - allows admin page to still load
  }

  return <AdminBookingsClient initial={bookings} />;
}
