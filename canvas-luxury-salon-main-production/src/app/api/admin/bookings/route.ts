import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  adminCookieName,
  verifySessionToken,
} from "@/lib/admin-session";
import { isBookingId } from "@/lib/booking-validation";
import { notifyGuestOfBookingStatus } from "@/lib/booking-status-notifications";
import { deleteBooking, patchBooking } from "@/lib/bookings-store";
import { isBookingStatus } from "@/lib/bookings-types";

export async function DELETE(request: Request) {
  const jar = await cookies();
  const token = jar.get(adminCookieName)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: string };
  try {
    body = (await request.json()) as { id?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    if (!body.id || !isBookingId(body.id)) {
      return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
    }
    const removed = await deleteBooking(body.id);
    if (!removed) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, id: removed.id });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const jar = await cookies();
  const token = jar.get(adminCookieName)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: {
    id?: string;
    status?: string;
    depositPaid?: number;
    depositNote?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  try {
    if (!body.id || !isBookingId(body.id)) {
      return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
    }

    const hasStatus = body.status !== undefined;
    const hasDeposit =
      body.depositPaid !== undefined || body.depositNote !== undefined;
    if (!hasStatus && !hasDeposit) {
      return NextResponse.json(
        { error: "Nothing to update." },
        { status: 400 }
      );
    }
    if (hasStatus && (!body.status || !isBookingStatus(body.status))) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const result = await patchBooking(body.id, {
      status: hasStatus && body.status && isBookingStatus(body.status)
        ? body.status
        : undefined,
      depositPaid:
        body.depositPaid !== undefined ? Number(body.depositPaid) : undefined,
      depositNote: body.depositNote,
    });
    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const { booking, previousStatus } = result;

    if (hasStatus) {
      void notifyGuestOfBookingStatus(booking, previousStatus).catch((err) =>
        console.error("[admin/bookings] Guest notify error:", err)
      );
    }

    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
