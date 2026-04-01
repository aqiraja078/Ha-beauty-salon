import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { BookingForm } from "@/components/booking/BookingForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book appointment",
  description: `Schedule a visit at ${site.name}.`,
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const sp = await searchParams;
  const decoded =
    typeof sp.service === "string" ? decodeURIComponent(sp.service) : undefined;

  return (
    <div className="pt-24 sm:pt-28">
      <section className="px-4 py-12 sm:px-6 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Booking</p>
            <h1 className="mt-3 font-display text-3xl text-white xs:text-4xl sm:text-5xl md:text-6xl">
              Reserve your time
            </h1>
            <p className="mt-4 text-sm text-white/70 sm:text-base">
              Choose a service and preferred slot. We will confirm by phone or
              email within 48 hours.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="#booking-form"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-8 text-xs font-semibold uppercase tracking-[0.2em] text-black"
              >
                Fill form
              </a>
              <a
                href="/contact"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/25 bg-white/5 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/90"
              >
                Need help
              </a>
            </div>
          </Reveal>
          <div id="booking-form" className="mt-10 sm:mt-14">
            <BookingForm defaultService={decoded} />
          </div>
        </div>
      </section>
    </div>
  );
}
