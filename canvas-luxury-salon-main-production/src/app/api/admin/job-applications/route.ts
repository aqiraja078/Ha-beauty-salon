import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  adminCookieName,
  verifySessionToken,
} from "@/lib/admin-session";
import {
  deleteJobApplication,
  getJobApplications,
} from "@/lib/job-applications-store";

async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get(adminCookieName)?.value;
  return verifySessionToken(token);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getJobApplications());
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
  const removed = await deleteJobApplication(body.id);
  if (!removed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, id: removed.id });
}
