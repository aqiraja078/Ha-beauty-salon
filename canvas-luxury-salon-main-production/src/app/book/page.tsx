import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { BookingForm } from "@/components/booking/BookingForm";
import {
  getBookingServiceNames,
  getBookingServicePriceMap,
  getSiteContent,
} from "@/lib/content-store";
import { allHairServiceNames } from "@/lib/hair-services-data";
import { allMakeupServiceNames } from "@/lib/makeup-services-data";
import { allMehndiServiceNames } from "@/lib/mehndi-services-data";
import type { BookingMode } from "@/lib/bookings-types";
import { safeSearchParam } from "@/lib/booking-prefill";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book appointment",
  description: `Schedule a home beauty visit with ${site.name} in Jhelum, Dina, or Gujrat.`,
};

const assurances = [
  {
    title: "Confirmed in 48h",
    desc: "We reply by phone, WhatsApp, or email with your slot.",
  },
];

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; price?: string; mode?: string }>;
}) {
  const sp = await searchParams;
  const decoded = safeSearchParam(sp.service);
  const priceFromQuery = safeSearchParam(sp.price);
  const modeParam = safeSearchParam(sp.mode)?.toLowerCase();
  const defaultMode: BookingMode | undefined =
    modeParam === "bridal" ? "bridal" : undefined;

  const [services, servicePrices, siteLive] = await Promise.all([
    getBookingServiceNames(),
    getBookingServicePriceMap(),
    getSiteContent(),
  ]);

  const bridalServices = {
    mehndi: allMehndiServiceNames(),
    makeup: allMakeupServiceNames(),
    hair: allHairServiceNames(),
  };

  const formKey = [
    decoded ?? "",
    priceFromQuery ?? "",
    defaultMode ?? "single",
  ].join("|");

  return (
    <ThemeScope scope="book">
      <section className="aurora relative overflow-hidden px-4 pb-3 pt-[max(4.75rem,calc(env(safe-area-inset-top)+3rem))] sm:px-6 sm:pb-5 sm:pt-[max(6.5rem,env(safe-area-inset-top))] md:px-8">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Reveal blur>
            <p className="eyebrow">Booking</p>
            <h1 className="mt-1.5 font-display text-[2.1rem] leading-[1.08] text-ink xs:text-4xl sm:mt-2 sm:text-5xl">
              Reserve your <span className="accent-gradient-text">time</span>
            </h1>
            <p className="mx-auto mt-2.5 max-w-xl text-sm leading-relaxed text-ink-soft sm:mt-3 sm:text-base">
              Choose your service, area, and preferred time — then tap Send now
              to confirm your booking.{" "}
              <Link
                href="/how-to-book"
                className="font-medium text-accent hover:underline"
              >
                How to book?
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-4 pb-3 sm:px-6 sm:pb-4 md:px-8">
        <RevealGroup className="mx-auto grid max-w-md gap-2">
          {assurances.map((a) => (
            <RevealItem key={a.title} className="h-full">
              <div className="h-full rounded-2xl border border-line bg-surface px-4 py-3 text-center shadow-soft sm:py-3.5">
                <p className="text-sm font-semibold text-ink">{a.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {a.desc}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="border-t border-line bg-canvas-alt px-4 py-5 sm:px-6 sm:py-8 md:px-8 md:py-10">
        <div id="booking-form" className="mx-auto max-w-7xl scroll-mt-24">
          <BookingForm
            key={formKey}
            defaultService={decoded}
            defaultPrice={priceFromQuery}
            defaultMode={defaultMode}
            services={services}
            servicePrices={servicePrices}
            bridalServices={bridalServices}
            siteName={siteLive.name}
            phoneDigits={siteLive.phoneDigits}
          />

          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-center text-sm text-muted">
              Prefer to talk first?{" "}
              <Link href="/contact" className="font-medium text-accent hover:underline">
                Contact us
              </Link>{" "}
              and we will guide you to the right service.
            </p>
          </Reveal>
        </div>
      </section>
    </ThemeScope>
  );
}
