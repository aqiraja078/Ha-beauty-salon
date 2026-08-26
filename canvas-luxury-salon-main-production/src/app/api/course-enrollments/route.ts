import { NextResponse } from "next/server";
import {
  courseEnrollmentWhatsAppText,
  notifyAdminOfCourseEnrollment,
} from "@/lib/course-enrollment-notify";
import { addCourseEnrollment } from "@/lib/course-enrollments-store";
import { getCourseBySlug } from "@/lib/courses-store";
import { clientIpFromRequest, rateLimitBooking } from "@/lib/rate-limit";
import { site } from "@/lib/site";

export async function POST(request: Request) {
  const ip = clientIpFromRequest(request);
  const limited = rateLimitBooking(`course-enroll:${ip}`);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const courseSlug =
    typeof body.courseSlug === "string" ? body.courseSlug.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  if (!courseSlug) {
    return NextResponse.json({ error: "Course is required." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!phone || phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json(
      { error: "Valid phone number is required." },
      { status: 400 }
    );
  }

  const course = await getCourseBySlug(courseSlug);
  if (!course || !course.published) {
    return NextResponse.json(
      { error: "That course is no longer available." },
      { status: 404 }
    );
  }

  try {
    const app = await addCourseEnrollment({
      courseId: course.id,
      courseTitle: course.title,
      courseSlug: course.slug,
      coursePrice: course.price,
      courseDuration: course.duration,
      name,
      phone,
      email: typeof body.email === "string" ? body.email : undefined,
      city: typeof body.city === "string" ? body.city : undefined,
      message: typeof body.message === "string" ? body.message : undefined,
    });

    void notifyAdminOfCourseEnrollment(app).catch((err) =>
      console.error(
        "[course-enroll] admin email failed:",
        err instanceof Error ? err.message : String(err)
      )
    );

    const waText = courseEnrollmentWhatsAppText(app);
    const whatsappUrl = `https://wa.me/${site.phoneDigits}?text=${encodeURIComponent(waText)}`;

    return NextResponse.json({
      ok: true,
      id: app.id,
      whatsappUrl,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not submit." },
      { status: 400 }
    );
  }
}
