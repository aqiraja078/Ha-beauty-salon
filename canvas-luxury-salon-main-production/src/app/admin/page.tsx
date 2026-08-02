import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  adminCookieName,
  getAdminUsername,
  verifySessionToken,
} from "@/lib/admin-session";
import { getBookings, type Booking } from "@/lib/bookings-store";
import {
  getHomeContent,
  getServiceMenus,
  getSiteContent,
} from "@/lib/content-store";
import { AdminBookingsClient } from "./AdminBookingsClient";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

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
  }

  const [initialSite, initialHome, initialServices] = await Promise.all([
    getSiteContent(),
    getHomeContent(),
    getServiceMenus(),
  ]);

  return (
    <AdminBookingsClient
      initial={bookings}
      username={getAdminUsername()}
      initialSite={initialSite}
      initialHome={initialHome}
      initialServices={initialServices}
    />
  );
}
