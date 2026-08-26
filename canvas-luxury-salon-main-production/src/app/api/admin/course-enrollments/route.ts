import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  adminCookieName,
  verifySessionToken,
} from "@/lib/admin-session";
import type { CourseEnrollmentStatus } from "@/lib/course-enrollments-types";
import {
  deleteCourseEnrollment,
  getCourseEnrollments,
  updateCourseEnrollmentStatus,
} from "@/lib/course-enrollments-store";

const STATUSES: CourseEnrollmentStatus[] = [
  "pending",
  "approved",
  "rejected",
];

async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get(adminCookieName)?.value;
  return verifySessionToken(token);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getCourseEnrollments());
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { id?: string; status?: string };
  try {
    body = (await request.json()) as { id?: string; status?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!body.id) {
    return NextResponse.json({ error: "id required." }, { status: 400 });
  }
  if (
    !body.status ||
    !STATUSES.includes(body.status as CourseEnrollmentStatus)
  ) {
    return NextResponse.json({ error: "Valid status required." }, { status: 400 });
  }
  const updated = await updateCourseEnrollmentStatus(
    body.id,
    body.status as CourseEnrollmentStatus
  );
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { id?: string };
  try {
    body = (await request.json()) as { id?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!body.id) {
    return NextResponse.json({ error: "id required." }, { status: 400 });
  }
  const removed = await deleteCourseEnrollment(body.id);
  if (!removed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, id: removed.id });
}
