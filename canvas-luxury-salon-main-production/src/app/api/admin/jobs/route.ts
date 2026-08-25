import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  adminCookieName,
  verifySessionToken,
} from "@/lib/admin-session";
import {
  addJob,
  deleteJob,
  getJobs,
  updateJob,
} from "@/lib/jobs-store";
import type { JobPostInput } from "@/lib/jobs-types";
import { isJobType } from "@/lib/jobs-types";

async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get(adminCookieName)?.value;
  return verifySessionToken(token);
}

function parseInput(body: unknown): JobPostInput | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.title !== "string") return null;
  return {
    title: b.title,
    slug: typeof b.slug === "string" ? b.slug : undefined,
    location: typeof b.location === "string" ? b.location : undefined,
    type:
      typeof b.type === "string" && isJobType(b.type) ? b.type : undefined,
    salaryText: typeof b.salaryText === "string" ? b.salaryText : undefined,
    description: typeof b.description === "string" ? b.description : undefined,
    applyWhatsApp:
      typeof b.applyWhatsApp === "string" ? b.applyWhatsApp : undefined,
    applyEmail: typeof b.applyEmail === "string" ? b.applyEmail : undefined,
    active: typeof b.active === "boolean" ? b.active : undefined,
  };
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getJobs());
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const input = parseInput(body);
  if (!input || !input.title.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  try {
    const job = await addJob(input);
    return NextResponse.json(job, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not save." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  if (typeof b.id !== "string" || !b.id) {
    return NextResponse.json({ error: "id required." }, { status: 400 });
  }
  const input = parseInput(body);
  if (!input || !input.title.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  try {
    const updated = await updateJob(b.id, input);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not update." },
      { status: 400 }
    );
  }
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
  const removed = await deleteJob(body.id);
  if (!removed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, id: removed.id });
}
