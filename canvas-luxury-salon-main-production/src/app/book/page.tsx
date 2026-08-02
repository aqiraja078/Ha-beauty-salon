import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { BookingForm } from "@/components/booking/BookingForm";
import {
  getBookingServiceNames,
  getBookingServicePriceMap,
} from "@/lib/content-store";
import { formatFromPrice } from "@/lib/format-price";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book appointment",
  description: `Schedule a visit at ${site.name}.`,
};

const assurances = [
  { title: "Confirmed in 48h", desc: "We reply by phone or email with your slot." },
  { title: "Flexible timing", desc: "Morning to evening slots, seven days a week." },
];

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; price?: string }>;
}) {
  const sp = await searchParams;
  const decoded =
    typeof sp.service === "string" ? decodeURIComponent(sp.service) : undefined;
  const priceFromQuery =
    typeof sp.price === "string" ? decodeURIComponent(sp.price) : undefined;
  const services = await getBookingServiceNames();
  const servicePrices = await getBookingServicePriceMap();
  const displayPrice =
    priceFromQuery || (decoded ? servicePrices[decoded] : undefined);

  return (
    <ThemeScope scope="book">
      <section className="aurora relative overflow-hidden px-4 pb-6 pt-[max(5.25rem,calc(env(safe-area-inset-top)+3.5rem))] sm:px-6 sm:pb-14 sm:pt-[max(8rem,env(safe-area-inset-top))] md:px-8">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Reveal blur>
            <p className="eyebrow">Booking</p>
            <h1 className="mt-2.5 font-display text-[2.4rem] leading-[1.06] text-ink xs:text-5xl sm:mt-3 sm:text-6xl">
              Reserve your <span className="accent-gradient-text">time</span>
            </h1>
            <p className="mx-auto mt-3.5 max-w-xl text-sm leading-relaxed text-ink-soft sm:mt-5 sm:text-base">
              Choose a service and preferred slot. We will confirm by phone or
              email within 48 hours.
            </p>

            {decoded ? (
              <p className="mx-auto mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-accent/25 bg-accent-soft px-5 py-2.5 text-xs font-medium text-accent">
                <span>Selected: {decoded}</span>
                {displayPrice ? (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-fg">
                    {formatFromPrice(displayPrice)}
                  </span>
                ) : null}
              </p>
            ) : null}
          </Reveal>
        </div>
      </section>

      <section className="px-4 pb-4 sm:px-6 sm:pb-8 md:px-8">
        <RevealGroup className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 sm:gap-4">
          {assurances.map((a) => (
            <RevealItem key={a.title} className="h-full">
              <div className="h-full rounded-2xl border border-line bg-surface p-4 text-center shadow-soft sm:p-5">
                <p className="text-sm font-semibold text-ink">{a.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  {a.desc}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="border-t border-line bg-canvas-alt px-4 py-8 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div id="booking-form" className="mx-auto max-w-7xl scroll-mt-28">
          <BookingForm
            defaultService={decoded}
            defaultPrice={priceFromQuery}
            services={services}
            servicePrices={servicePrices}
          />

          <Reveal delay={0.1}>
            <p className="mx-auto mt-8 max-w-xl text-center text-sm text-muted">
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
