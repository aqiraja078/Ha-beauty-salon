import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { HeroImageSlider } from "@/components/ui/HeroImageSlider";
import { serviceCategories, site } from "@/lib/site";

const heroImages = [
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1400&q=80",
];

export const metadata: Metadata = {
  title: "Services",
  description: `Hair, facial, body, and makeup home services by ${site.name} in Jhelum, Dina, and Gujrat.`,
};

const detailBlocks = [
  {
    title: "Hair treatments",
    items: ["Color & gloss", "Extensions", "Cut & styling", "Repair rituals"],
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=85",
    href: "/services/hair" as const,
    accent: "border-l-gold/80",
  },
  {
    title: "Facial treatments",
    items: ["Brightening", "Deep cleanse", "Anti-fatigue", "Pre-event prep"],
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=85",
    href: "/services/facial" as const,
    accent: "border-l-emerald-400/50",
  },
  {
    title: "Body & spa",
    items: ["Massage", "Moroccan bath", "Body polish", "Bridal spa"],
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=85",
    href: "/services/body-spa" as const,
    accent: "border-l-sky-400/50",
  },
  {
    title: "Makeup services",
    items: ["Bridal", "Engagement", "Party", "Editorial"],
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=85",
    href: "/services/makeup" as const,
    accent: "border-l-rose-300/50",
  },
];

const chipScroll =
  "flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden";

const chip =
  "inline-flex min-h-[44px] shrink-0 snap-start items-center justify-center rounded-full border px-4 text-[10px] font-semibold uppercase tracking-widest transition active:scale-[0.98] xs:px-5 xs:text-[11px]";

export default function ServicesPage() {
  return (
    <div className="pt-[max(5.5rem,env(safe-area-inset-top,0px))] sm:pt-28">
      <section className="relative min-h-[46vh] overflow-hidden px-4 pb-10 sm:min-h-[58vh] sm:px-6 sm:pb-14 md:px-8 md:pb-16">
        <div className="absolute inset-0 -z-10">
          <HeroImageSlider images={heroImages} alt="Salon full service hero" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-background/28 to-background/88" />
        </div>
        <div className="mx-auto flex min-h-[42vh] max-w-7xl flex-col justify-end sm:min-h-[50vh] sm:justify-center">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.38em] text-gold xs:text-xs">
              Menu · {site.name}
            </p>
            <h1 className="mt-2 max-w-[15ch] font-display text-[2rem] leading-[1.08] text-white xs:max-w-none xs:text-4xl sm:mt-3 sm:text-5xl md:text-6xl">
              Services for every occasion
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:mt-6 sm:text-base">
              Curated rituals — quiet maintenance to show-stopping event looks.
              Swipe chips below on your phone to jump menus.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
              <Link
                href="/book"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-6 text-xs font-semibold uppercase tracking-[0.2em] text-black sm:w-auto sm:px-8"
              >
                Book now
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 transition hover:border-gold/45 sm:w-auto sm:px-8"
              >
                Contact
              </Link>
            </div>
            <div className={`${chipScroll} -mx-4 mt-6 px-4 sm:mx-0 sm:mt-8 sm:px-0`}>
              <Link
                href="/services/hair"
                className={`${chip} border-gold/45 bg-gold/10 text-gold hover:border-gold hover:bg-gold/15`}
              >
                Hair menu
              </Link>
              <Link
                href="/services/facial"
                className={`${chip} border-white/20 bg-white/5 text-white/85 hover:border-gold/40 hover:bg-white/10`}
              >
                Facial
              </Link>
              <Link
                href="/services/body-spa"
                className={`${chip} border-white/20 bg-white/5 text-white/85 hover:border-gold/40 hover:bg-white/10`}
              >
                Body & spa
              </Link>
              <Link
                href="/services/nails"
                className={`${chip} border-white/20 bg-white/5 text-white/85 hover:border-gold/40 hover:bg-white/10`}
              >
                Nails
              </Link>
              <Link
                href="/services/mehndi"
                className={`${chip} border-white/20 bg-white/5 text-white/85 hover:border-gold/40 hover:bg-white/10`}
              >
                Mehndi
              </Link>
              <Link
                href="/services/makeup"
                className={`${chip} border-white/20 bg-white/5 text-white/85 hover:border-gold/40 hover:bg-white/10`}
              >
                Makeup
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/5 px-4 py-10 sm:px-6 sm:py-14 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {serviceCategories.map((s, idx) => (
            <Reveal key={s.slug} delay={idx * 0.05} scale>
              <Link
                href={s.href}
                className="group flex h-full min-h-[280px] flex-col overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.02] transition active:scale-[0.99] sm:min-h-0 sm:rounded-2xl sm:hover:-translate-y-1 sm:hover:border-gold/35 sm:hover:shadow-gold"
              >
                <div className="relative aspect-[4/5] w-full min-h-[200px] overflow-hidden sm:min-h-0">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <h2 className="font-display text-xl text-white drop-shadow-md sm:text-2xl md:text-[1.65rem]">
                      {s.title}
                    </h2>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <p className="text-sm leading-relaxed text-white/70">
                    {s.short}
                  </p>
                  <span className="mt-4 inline-flex min-h-[44px] items-center text-xs font-semibold uppercase tracking-[0.2em] text-gold transition group-hover:text-gold-light">
                    View details →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {detailBlocks.map((block, i) => (
        <section
          key={block.title}
          className={`border-t border-white/5 px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 ${
            i % 2 === 1 ? "bg-white/[0.02]" : ""
          }`}
        >
          <div className="mx-auto grid max-w-7xl items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal
              scale
              className={`order-1 lg:order-none ${i % 2 === 1 ? "lg:order-2" : ""}`}
            >
              <div
                className={`relative aspect-[16/11] overflow-hidden rounded-2xl border border-l-4 ${block.accent} border-y border-r border-white/10 sm:aspect-[4/3]`}
              >
                <Image
                  src={block.image}
                  alt={block.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </Reveal>
            <Reveal
              scale
              className={`order-2 lg:order-none ${i % 2 === 1 ? "lg:order-1" : ""}`}
              delay={0.08}
            >
              <p className="text-[10px] uppercase tracking-[0.32em] text-gold xs:text-xs">
                Signature
              </p>
              <h2 className="mt-2 font-display text-2xl leading-tight text-white sm:text-3xl md:text-4xl">
                {block.title}
              </h2>
              <ul className="mt-5 space-y-3 sm:mt-8">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-white/70 sm:text-base"
                  >
                    <span className="mt-2 h-px w-6 shrink-0 bg-gold/60 sm:w-8" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap">
                <Link
                  href="/book"
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-gold/45 bg-gold/10 px-6 text-xs uppercase tracking-[0.2em] text-gold transition hover:bg-gold/18 sm:w-auto sm:px-8"
                >
                  Book now
                </Link>
                <Link
                  href={block.href}
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/20 px-6 text-xs uppercase tracking-[0.2em] text-white/85 transition hover:border-gold/45 hover:bg-white/5 sm:w-auto sm:px-8"
                >
                  View menu
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      ))}
    </div>
  );
}
