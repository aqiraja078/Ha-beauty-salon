import type { Metadata } from "next";
import Link from "next/link";
import { OfferCard } from "@/components/offers/OfferCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getHomeContent, getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [home, site] = await Promise.all([getHomeContent(), getSiteContent()]);
  return {
    title: "Sales",
    description: `${home.offers.lead} — ${site.name}.`,
  };
}

export default async function SalesPage() {
  const [home, site] = await Promise.all([getHomeContent(), getSiteContent()]);
  const { offers } = home;
  const contactLabel = `Ask ${site.name.split(" ")[0]}`;

  return (
    <ThemeScope scope="book">
      <section className="aurora relative overflow-hidden px-4 pb-6 pt-[max(5.25rem,calc(env(safe-area-inset-top)+3.5rem))] sm:px-6 sm:pb-14 sm:pt-[max(8rem,env(safe-area-inset-top))] md:px-8">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Reveal blur>
            <p className="eyebrow">{offers.eyebrow}</p>
            <h1 className="mt-2.5 font-display text-[2.4rem] leading-[1.06] text-ink xs:text-5xl sm:mt-3 sm:text-6xl">
              Current <span className="accent-gradient-text">sales</span>
            </h1>
            <p className="mx-auto mt-3.5 max-w-xl text-sm leading-relaxed text-ink-soft sm:mt-5 sm:text-base">
              {offers.lead}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-canvas px-4 py-6 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          {offers.items.length > 0 ? (
            <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
              {offers.items.map((offer) => (
                <RevealItem key={offer.id} className="h-full min-w-0">
                  <OfferCard
                    offer={offer}
                    featured
                    contactHref="/contact"
                    contactLabel={contactLabel}
                  />
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <p className="text-center text-sm text-ink-soft">
              No sales right now — check back soon or{" "}
              <Link href="/contact" className="font-medium text-accent hover:underline">
                contact us
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-line bg-canvas-alt px-4 py-8 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="font-display text-2xl text-ink sm:text-3xl">
              Ready to lock a date?
            </h2>
            <p className="mt-3 text-sm text-ink-soft sm:text-base">
              Tell us which package fits — we confirm within 48 hours for{" "}
              {site.address}.
            </p>
            <div className="mt-6 flex w-full max-w-md flex-row items-center justify-center gap-2 sm:mt-8 sm:max-w-none sm:gap-3">
              <Link
                href="/book"
                className="btn-primary min-w-0 flex-1 px-3 text-[10px] tracking-[0.12em] xs:px-4 xs:text-[11px] sm:w-auto sm:flex-none sm:px-8 sm:tracking-[0.2em]"
              >
                Book appointment
              </Link>
              <Link
                href="/contact"
                className="btn-ghost min-w-0 flex-1 px-3 text-[10px] tracking-[0.12em] xs:px-4 xs:text-[11px] sm:w-auto sm:flex-none sm:px-8 sm:tracking-[0.2em]"
              >
                Contact
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </ThemeScope>
  );
}
