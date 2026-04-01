import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "salon_admin_session";

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "huma-dev-secret-change-in-production";
}

export function createSessionToken(): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ exp }), "utf-8").toString(
    "base64url"
  );
  const sig = createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    ) as { exp: number };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function getAdminUsername(): string {
  const fromEnv = process.env.ADMIN_USERNAME?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : "huma-admin";
}

/** Usernames that may sign in (configured + legacy so .env / form mismatch does not lock you out). */
function acceptedAdminUsernames(): string[] {
  const primary = getAdminUsername();
  return Array.from(new Set([primary, "huma-admin", "canvas-admin"]));
}

export function verifyAdminUsername(username: string): boolean {
  const input = username.normalize("NFKC").trim();
  for (const candidate of acceptedAdminUsernames()) {
    const exp = candidate.normalize("NFKC");
    if (input.length !== exp.length) continue;
    try {
      if (
        timingSafeEqual(
          Buffer.from(input, "utf-8"),
          Buffer.from(exp, "utf-8")
        )
      ) {
        return true;
      }
    } catch {
      /* continue */
    }
  }
  return false;
}

/**
 * If ADMIN_PASSWORD is set in env, only that value works (use quotes in .env for @ ! #).
 * If unset, either built-in default works: HumaAdmin@123! or legacy CanvasAdmin@123!
 */
export function verifyAdminPassword(password: string): boolean {
  const fromEnv = process.env.ADMIN_PASSWORD?.replace(/^\uFEFF/, "").trim();
  const candidates =
    fromEnv && fromEnv.length > 0
      ? [fromEnv]
      : ["HumaAdmin@123!", "CanvasAdmin@123!"];

  const input = password.normalize("NFKC").trim();
  for (const raw of candidates) {
    const exp = raw.normalize("NFKC");
    if (input.length !== exp.length) continue;
    try {
      if (
        timingSafeEqual(
          Buffer.from(input, "utf-8"),
          Buffer.from(exp, "utf-8")
        )
      ) {
        return true;
      }
    } catch {
      /* continue */
    }
  }
  return false;
}

export const adminCookieName = COOKIE;
