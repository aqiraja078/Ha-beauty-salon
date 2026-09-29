import type { CourseEnrollment } from "@/lib/course-enrollments-types";
import { getSiteContent } from "@/lib/content-store";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendWithResend(
  to: string,
  subject: string,
  html: string,
  text: string
) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.NOTIFY_EMAIL_FROM?.trim();
  if (!apiKey || !from) return;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("[course-enroll] Resend failed:", res.status, err);
  }
}

/** Notify salon admin (email) of a new course enrollment. */
export async function notifyAdminOfCourseEnrollment(
  app: CourseEnrollment
): Promise<void> {
  const site = await getSiteContent();
  const to =
    process.env.ADMIN_NOTIFY_EMAIL?.trim() || site.email?.trim() || "";
  if (!to) return;

  const subject = `Course enrollment — ${app.name} · ${app.courseTitle}`;
  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Georgia, serif; line-height: 1.6; color: #111; max-width: 560px;">
  <p>A new course enrollment request arrived.</p>
  <table style="border-collapse: collapse; margin: 16px 0;">
    <tr><td style="padding: 4px 12px 4px 0; color: #666;">Course</td><td>${escapeHtml(app.courseTitle)}</td></tr>
    <tr><td style="padding: 4px 12px 4px 0; color: #666;">Price</td><td>${escapeHtml(app.coursePrice || "—")}</td></tr>
    <tr><td style="padding: 4px 12px 4px 0; color: #666;">Name</td><td>${escapeHtml(app.name)}</td></tr>
    <tr><td style="padding: 4px 12px 4px 0; color: #666;">Phone</td><td>${escapeHtml(app.phone)}</td></tr>
    <tr><td style="padding: 4px 12px 4px 0; color: #666;">Email</td><td>${escapeHtml(app.email || "—")}</td></tr>
    <tr><td style="padding: 4px 12px 4px 0; color: #666;">City</td><td>${escapeHtml(app.city || "—")}</td></tr>
    <tr><td style="padding: 4px 12px 4px 0; color: #666;">Message</td><td>${escapeHtml(app.message || "—")}</td></tr>
  </table>
  <p style="font-size: 14px; color: #555;">Open the staff console → Courses → Enrollments to review.</p>
</body>
</html>`;
  const text = `COURSE ENROLLMENT — ${site.name}\n\nCourse: ${app.courseTitle}\nPrice: ${app.coursePrice || "—"}\nName: ${app.name}\nPhone: ${app.phone}\nEmail: ${app.email || "—"}\nCity: ${app.city || "—"}\nMessage: ${app.message || "—"}`;

  await sendWithResend(to, subject, html, text);
}

export function courseEnrollmentWhatsAppText(app: {
  courseTitle: string;
  coursePrice?: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  message?: string;
}): string {
  return [
    `*Course enrollment — ${app.courseTitle}*`,
    app.coursePrice ? `Price: ${app.coursePrice}` : null,
    ``,
    `Name: ${app.name}`,
    `Phone: ${app.phone}`,
    app.email ? `Email: ${app.email}` : null,
    app.city ? `City: ${app.city}` : null,
    app.message ? `Message: ${app.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
