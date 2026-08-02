import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ThemeScope } from "@/components/ui/ThemeScope";
import { getHomeContent, getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

const OffersSlider = nextDynamic(
  () =>
    import("@/components/offers/OffersSlider").then((m) => ({
      default: m.OffersSlider,
    })),
  {
    loading: () => (
      <div
        className="mx-auto h-80 max-w-7xl animate-pulse rounded-3xl bg-canvas-alt"
        aria-hidden
      />
    ),
  }
);

export async function generateMetadata(): Promise<Metadata> {
  const [home, site] = await Promise.all([getHomeContent(), getSiteContent()]);
  return {
    title: "Offers",
    description: `${home.offers.lead} — ${site.name}.`,
  };
}

export default async function OffersPage() {
  const [home, site] = await Promise.all([getHomeContent(), getSiteContent()]);
  const { offers } = home;

  return (
    <ThemeScope scope="book">
      <section className="aurora relative overflow-hidden px-4 pb-6 pt-[max(5.25rem,calc(env(safe-area-inset-top)+3.5rem))] sm:px-6 sm:pb-14 sm:pt-[max(8rem,env(safe-area-inset-top))] md:px-8">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Reveal blur>
            <p className="eyebrow">{offers.eyebrow}</p>
            <h1 className="mt-2.5 font-display text-[2.4rem] leading-[1.06] text-ink xs:text-5xl sm:mt-3 sm:text-6xl">
              Current <span className="accent-gradient-text">offers</span>
            </h1>
            <p className="mx-auto mt-3.5 max-w-xl text-sm leading-relaxed text-ink-soft sm:mt-5 sm:text-base">
              {offers.lead}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-canvas px-4 py-6 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <OffersSlider
            items={offers.items}
            featured
            contactHref="/contact"
            contactLabel={`Ask ${site.name.split(" ")[0]}`}
          />
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
              {site.address.replace("Home Service Areas: ", "")}.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-center">
              <Link href="/book" className="btn-primary w-full max-w-sm sm:w-auto">
                Book appointment
              </Link>
              <Link href="/contact" className="btn-ghost w-full max-w-sm sm:w-auto">
                Contact
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </ThemeScope>
  );
}
