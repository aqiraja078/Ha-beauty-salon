import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  adminCookieName,
  verifySessionToken,
} from "@/lib/admin-session";
import {
  getBlockedDates,
  setBlockedDates,
} from "@/lib/blocked-dates-store";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(adminCookieName)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await getBlockedDates();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const jar = await cookies();
  const token = jar.get(adminCookieName)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { dates?: string[] };
  try {
    body = (await request.json()) as { dates?: string[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!Array.isArray(body.dates)) {
    return NextResponse.json({ error: "dates array required." }, { status: 400 });
  }
  const next = await setBlockedDates(body.dates.map(String));
  return NextResponse.json(next);
}
