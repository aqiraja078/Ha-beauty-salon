import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  adminCookieName,
  verifySessionToken,
} from "@/lib/admin-session";

export async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get(adminCookieName)?.value;
  if (!verifySessionToken(token)) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true as const };
}
