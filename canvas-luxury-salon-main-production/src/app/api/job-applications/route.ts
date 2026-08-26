import { NextResponse } from "next/server";
import { jobApplicationWhatsAppText, notifyAdminOfJobApplication } from "@/lib/job-application-notify";
import { addJobApplication } from "@/lib/job-applications-store";
import { getJobBySlug } from "@/lib/jobs-store";
import { clientIpFromRequest, rateLimitBooking } from "@/lib/rate-limit";
import { site } from "@/lib/site";

export async function POST(request: Request) {
  const ip = clientIpFromRequest(request);
  const limited = rateLimitBooking(`job-apply:${ip}`);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many applications. Please try again later." },
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

  const jobSlug = typeof body.jobSlug === "string" ? body.jobSlug.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  if (!jobSlug) {
    return NextResponse.json({ error: "Job is required." }, { status: 400 });
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

  const job = await getJobBySlug(jobSlug);
  if (!job || !job.active) {
    return NextResponse.json(
      { error: "That role is no longer open." },
      { status: 404 }
    );
  }

  try {
    const app = await addJobApplication({
      jobId: job.id,
      jobTitle: job.title,
      jobSlug: job.slug,
      name,
      phone,
      email: typeof body.email === "string" ? body.email : undefined,
      city: typeof body.city === "string" ? body.city : undefined,
      experience:
        typeof body.experience === "string" ? body.experience : undefined,
      message: typeof body.message === "string" ? body.message : undefined,
    });

    void notifyAdminOfJobApplication(app).catch((err) =>
      console.error(
        "[job-apply] admin email failed:",
        err instanceof Error ? err.message : String(err)
      )
    );

    const waDigits = job.applyWhatsApp || site.phoneDigits;
    const waText = jobApplicationWhatsAppText(app);
    const whatsappUrl = `https://wa.me/${waDigits}?text=${encodeURIComponent(waText)}`;

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
