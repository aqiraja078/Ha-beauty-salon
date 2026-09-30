import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSiteContent } from "@/lib/content-store";
import { getPublicSiteOrigin } from "@/lib/public-site-url";
import {
  slipEmailHtml,
  slipEmailSubject,
  slipEmailText,
} from "@/lib/slip-email";
import { getSlipById } from "@/lib/slips-store";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Email a slip via Resend. If Resend is not configured we say so, and the UI falls back to mailto:. */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body: { id?: unknown; to?: unknown; origin?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const to = typeof body.to === "string" ? body.to.trim() : "";
  if (!EMAIL_RE.test(to)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  const slip = typeof body.id === "string" ? await getSlipById(body.id) : null;
  if (!slip) return NextResponse.json({ error: "Slip not found." }, { status: 404 });

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.NOTIFY_EMAIL_FROM?.trim();
  if (!apiKey || !from) {
    return NextResponse.json(
      { sent: false, reason: "not_configured" },
      { status: 200 }
    );
  }

  const site = await getSiteContent();
  const origin =
    typeof body.origin === "string" && /^https?:\/\//.test(body.origin)
      ? new URL(body.origin).origin
      : getPublicSiteOrigin();
  const link = `${origin}/slip/${slip.publicId}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: slipEmailSubject(slip, site),
      html: slipEmailHtml(slip, site, link),
      text: slipEmailText(slip, site, link),
    }),
  });
  if (!res.ok) {
    console.error("[slip-email] Resend failed:", res.status, await res.text());
    return NextResponse.json(
      { error: "The email service rejected the message. Try again or use WhatsApp." },
      { status: 502 }
    );
  }
  return NextResponse.json({ sent: true });
}
