import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  adminCookieName,
  verifySessionToken,
} from "@/lib/admin-session";
import {
  addClient,
  deleteClient,
  getClients,
  updateClient,
} from "@/lib/clients-store";
import type { SalonClientInput } from "@/lib/clients-types";

async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get(adminCookieName)?.value;
  return verifySessionToken(token);
}

function parseInput(body: unknown): SalonClientInput | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.name !== "string") return null;
  return {
    name: b.name,
    phone: typeof b.phone === "string" ? b.phone : undefined,
    email: typeof b.email === "string" ? b.email : undefined,
    idCard: typeof b.idCard === "string" ? b.idCard : undefined,
    area: typeof b.area === "string" ? b.area : undefined,
    address: typeof b.address === "string" ? b.address : undefined,
    notes: typeof b.notes === "string" ? b.notes : undefined,
    preferences: typeof b.preferences === "string" ? b.preferences : undefined,
  };
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const clients = await getClients();
  return NextResponse.json(clients);
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
  if (!input || !input.name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  try {
    const client = await addClient(input);
    return NextResponse.json(client, { status: 201 });
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
  if (!input || !input.name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  try {
    const updated = await updateClient(b.id, input);
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
  const removed = await deleteClient(body.id);
  if (!removed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, id: removed.id });
}
