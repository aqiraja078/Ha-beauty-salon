import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  adminCookieName,
  verifySessionToken,
} from "@/lib/admin-session";
import {
  addCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "@/lib/courses-store";
import type { CourseInput } from "@/lib/courses-types";

async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get(adminCookieName)?.value;
  return verifySessionToken(token);
}

function parseInput(body: unknown): CourseInput | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.title !== "string") return null;
  return {
    title: b.title,
    slug: typeof b.slug === "string" ? b.slug : undefined,
    coverImage: typeof b.coverImage === "string" ? b.coverImage : undefined,
    price: typeof b.price === "string" ? b.price : undefined,
    duration: typeof b.duration === "string" ? b.duration : undefined,
    level: typeof b.level === "string" ? b.level : undefined,
    description: typeof b.description === "string" ? b.description : undefined,
    whatsappNote:
      typeof b.whatsappNote === "string" ? b.whatsappNote : undefined,
    published: typeof b.published === "boolean" ? b.published : undefined,
  };
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getCourses());
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
    const course = await addCourse(input);
    return NextResponse.json(course, { status: 201 });
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
    const updated = await updateCourse(b.id, input);
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
  const removed = await deleteCourse(body.id);
  if (!removed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, id: removed.id });
}
