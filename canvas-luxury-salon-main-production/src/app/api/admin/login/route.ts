import { NextResponse } from "next/server";
import {
  adminCookieName,
  createSessionToken,
  verifyAdminPassword,
  verifyAdminUsername,
} from "@/lib/admin-session";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };
    if (!verifyAdminUsername(body.username ?? "")) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }
    if (!verifyAdminPassword(body.password ?? "")) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }
    const token = createSessionToken();
    const res = NextResponse.json({ ok: true });
    // Secure cookies break login on plain HTTP (localhost / bad proxy). Optional force-insecure.
    const url = new URL(request.url);
    const forwarded = request.headers.get("x-forwarded-proto");
    const forceInsecure =
      process.env.ADMIN_COOKIE_INSECURE === "1" ||
      process.env.ADMIN_COOKIE_INSECURE === "true";
    const secureCookie =
      !forceInsecure &&
      (forwarded === "https" || url.protocol === "https:");
    res.cookies.set(adminCookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: secureCookie,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
