import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  addSlip,
  cleanSlipInput,
  deleteSlip,
  getSlips,
  updateSlip,
} from "@/lib/slips-store";

async function json(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const b = await request.json();
    return b && typeof b === "object" ? (b as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

const INVALID =
  "Client name and at least one item (with a description) are required.";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  return NextResponse.json(await getSlips(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const b = await json(request);
  if (!b) return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  const input = cleanSlipInput(b);
  if (!input) return NextResponse.json({ error: INVALID }, { status: 400 });
  return NextResponse.json(await addSlip(input), { status: 201 });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const b = await json(request);
  if (!b || typeof b.id !== "string" || !b.id) {
    return NextResponse.json({ error: "id required." }, { status: 400 });
  }
  const input = cleanSlipInput(b);
  if (!input) return NextResponse.json({ error: INVALID }, { status: 400 });
  const updated = await updateSlip(b.id, input);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const b = await json(request);
  if (!b || typeof b.id !== "string" || !b.id) {
    return NextResponse.json({ error: "id required." }, { status: 400 });
  }
  const removed = await deleteSlip(b.id);
  if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, id: removed.id });
}
