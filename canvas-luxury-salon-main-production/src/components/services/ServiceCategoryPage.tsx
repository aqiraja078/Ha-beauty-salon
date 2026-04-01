import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { HeroImageSlider } from "@/components/ui/HeroImageSlider";
import type { ServiceMenuSection } from "@/components/services/service-menu-mappers";

export type ServiceThemeId =
  | "hair"
  | "makeup"
  | "facial"
  | "bodySpa"
  | "nails"
  | "mehndi";

type QuickLink = { href: string; label: string };

type Props = {
  theme: ServiceThemeId;
  heroImages: string[];
  heroAlt: string;
  kicker: string;
  title: string;
  description: string;
  quickLinks: QuickLink[];
  sections: ServiceMenuSection[];
  footerNote: string;
};

const chipRow =
  "flex snap-x snap-mandatory gap-2 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden";

const chipBase =
  "inline-flex min-h-[44px] shrink-0 snap-start items-center justify-center rounded-full border px-4 text-[10px] font-semibold uppercase tracking-[0.18em] transition active:scale-[0.98] xs:px-5 xs:text-[11px] sm:min-h-0 sm:py-2";

function themeClasses(id: ServiceThemeId) {
  switch (id) {
    case "hair":
      return {
        hero:
          "min-h-[40vh] sm:min-h-[56vh] lg:min-h-[60vh] rounded-b-[1.5rem] sm:rounded-b-none",
        overlay:
          "bg-gradient-to-b from-black/75 via-background/35 to-background/93",
        heroInner:
          "flex min-h-[inherit] flex-col justify-end pb-6 pt-4 sm:justify-center sm:pb-12 sm:pt-0",
        sectionBgAlt: "bg-white/[0.025]",
        h2: "font-display text-[1.65rem] leading-tight text-white xs:text-3xl sm:text-4xl md:text-[2.25rem]",
        rule: "mt-3 h-1 w-14 rounded-full bg-gold/70",
        grid: "mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3",
        card: "flex min-h-0 flex-col border border-y border-r border-white/10 border-l-[3px] border-l-gold/80 bg-white/[0.035] p-4 backdrop-blur-sm transition active:scale-[0.99] sm:rounded-r-2xl sm:p-6",
        chipOff: `${chipBase} border-white/18 bg-white/[0.04] text-white/80 hover:border-gold/45 hover:text-gold`,
        chipOn: `${chipBase} border-gold/45 bg-gold/10 text-gold`,
      };
    case "makeup":
      return {
        hero:
          "min-h-[42vh] sm:min-h-[58vh] rounded-b-[2rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.65)]",
        overlay:
          "bg-gradient-to-b from-rose-950/50 via-background/32 to-background/93",
        heroInner:
          "flex min-h-[inherit] flex-col justify-end pb-8 sm:justify-center sm:pb-14",
        sectionBgAlt: "bg-rose-950/[0.06]",
        h2: "font-display text-[1.65rem] leading-tight text-white xs:text-3xl sm:text-4xl md:text-[2.25rem]",
        rule: "mt-3 h-px w-20 bg-gradient-to-r from-rose-300/60 to-transparent",
        grid: "mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3",
        card: "flex min-h-0 flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-rose-950/30 to-white/[0.03] p-4 ring-1 ring-rose-500/15 backdrop-blur-sm transition active:scale-[0.99] sm:p-6",
        chipOff: `${chipBase} border-white/18 bg-white/[0.04] text-white/80 hover:border-rose-300/40 hover:text-rose-100`,
        chipOn: `${chipBase} border-rose-300/40 bg-rose-500/10 text-rose-100`,
      };
    case "facial":
      return {
        hero: "min-h-[41vh] sm:min-h-[56vh]",
        overlay:
          "bg-gradient-to-b from-emerald-950/40 via-background/30 to-background/93",
        heroInner:
          "flex min-h-[inherit] flex-col justify-end pb-7 sm:justify-center sm:pb-12",
        sectionBgAlt: "bg-emerald-950/[0.05]",
        h2: "font-display text-[1.65rem] leading-tight text-white xs:text-3xl sm:text-4xl md:text-[2.25rem]",
        rule: "mt-3 h-1 w-12 rounded-full bg-emerald-400/50",
        grid: "mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3",
        card: "flex min-h-0 flex-col rounded-3xl border border-emerald-900/30 bg-white/[0.04] p-4 backdrop-blur-sm transition active:scale-[0.99] sm:p-6",
        chipOff: `${chipBase} border-white/18 bg-white/[0.04] text-white/80 hover:border-emerald-400/35 hover:text-emerald-100`,
        chipOn: `${chipBase} border-emerald-400/35 bg-emerald-500/10 text-emerald-100`,
      };
    case "bodySpa":
      return {
        hero: "min-h-[38vh] sm:min-h-[54vh]",
        overlay:
          "bg-gradient-to-b from-sky-950/35 via-background/28 to-background/94",
        heroInner:
          "flex min-h-[inherit] flex-col justify-center pb-8 pt-2 sm:pb-12",
        sectionBgAlt: "bg-sky-950/[0.04]",
        h2: "font-display text-[1.65rem] leading-tight text-white xs:text-3xl sm:text-4xl md:text-[2.25rem]",
        rule: "mt-3 w-24 border-t-2 border-sky-400/40 border-double",
        grid: "mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3",
        card: "flex min-h-0 flex-col rounded-xl border border-sky-900/25 bg-gradient-to-br from-sky-950/20 to-white/[0.02] p-4 sm:p-6",
        chipOff: `${chipBase} border-white/18 bg-white/[0.04] text-white/80 hover:border-sky-300/40 hover:text-sky-100`,
        chipOn: `${chipBase} border-sky-300/40 bg-sky-500/10 text-sky-100`,
      };
    case "nails":
      return {
        hero: "min-h-[36vh] sm:min-h-[52vh]",
        overlay:
          "bg-gradient-to-b from-fuchsia-950/35 via-background/28 to-background/94",
        heroInner:
          "flex min-h-[inherit] flex-col justify-end pb-6 sm:justify-center sm:pb-11",
        sectionBgAlt: "bg-fuchsia-950/[0.05]",
        h2: "font-display text-[1.5rem] leading-tight text-white xs:text-2xl sm:text-3xl md:text-4xl",
        rule: "mt-2.5 h-0.5 w-16 bg-fuchsia-400/55",
        grid: "mt-7 grid grid-cols-1 gap-3 xs:grid-cols-2 sm:mt-9 sm:gap-4 xl:grid-cols-3",
        card: "flex min-h-0 flex-col rounded-xl border border-fuchsia-900/25 bg-white/[0.04] p-3.5 sm:p-5",
        chipOff: `${chipBase} border-white/18 bg-white/[0.04] text-white/80 hover:border-fuchsia-300/40 hover:text-fuchsia-100`,
        chipOn: `${chipBase} border-fuchsia-300/40 bg-fuchsia-500/10 text-fuchsia-100`,
      };
    case "mehndi":
      return {
        hero:
          "min-h-[40vh] sm:min-h-[56vh] rounded-b-[1.25rem] sm:rounded-b-none border-b border-gold/15",
        overlay:
          "bg-gradient-to-b from-amber-950/45 via-background/30 to-background/93",
        heroInner:
          "flex min-h-[inherit] flex-col justify-end pb-7 sm:justify-center sm:pb-12",
        sectionBgAlt: "bg-amber-950/[0.07]",
        h2: "font-display text-[1.65rem] leading-tight text-white xs:text-3xl sm:text-4xl md:text-[2.25rem]",
        rule: "mt-3 flex gap-1",
        grid: "mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3",
        card: "flex min-h-0 flex-col rounded-lg border-2 border-double border-gold/35 bg-amber-950/15 p-4 sm:p-6",
        chipOff: `${chipBase} border-white/18 bg-white/[0.04] text-white/80 hover:border-gold/50 hover:text-gold-light`,
        chipOn: `${chipBase} border-gold/50 bg-gold/10 text-gold-light`,
      };
    default: {
      const _x: never = id;
      void _x;
      return themeClasses("hair");
    }
  }
}

export function ServiceCategoryPage({
  theme,
  heroImages,
  heroAlt,
  kicker,
  title,
  description,
  quickLinks,
  sections,
  footerNote,
}: Props) {
  const t = themeClasses(theme);

  return (
    <div className="pt-[max(5.5rem,env(safe-area-inset-top,0px))] sm:pt-28">
      <section
        className={`relative overflow-hidden px-4 pb-2 sm:px-6 md:px-8 ${t.hero}`}
      >
        <div className="absolute inset-0 top-0 -z-10">
          <HeroImageSlider images={heroImages} alt={heroAlt} />
          <div className={`absolute inset-0 ${t.overlay}`} />
        </div>
        <div className={`mx-auto max-w-7xl ${t.heroInner}`}>
          <Reveal>
            <Link
              href="/services"
              className="inline-flex min-h-[44px] items-center text-xs uppercase tracking-[0.22em] text-gold/85 hover:text-gold sm:min-h-0"
            >
              ← All services
            </Link>
            <p className="mt-4 text-[10px] uppercase tracking-[0.38em] text-gold xs:text-xs sm:mt-6">
              {kicker}
            </p>
            <h1 className="mt-2 max-w-[18ch] font-display text-[1.85rem] leading-[1.1] text-white xs:max-w-none xs:text-4xl sm:mt-3 sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:mt-6 sm:text-base">
              {description}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
              <Link
                href="/book"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-6 text-xs font-semibold uppercase tracking-[0.2em] text-black sm:w-auto sm:px-8"
              >
                Book now
              </Link>
              <Link
                href="/services"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/25 bg-white/[0.04] px-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 transition hover:border-gold/45 sm:w-auto sm:px-8"
              >
                All services
              </Link>
            </div>
            <div
              className={`${chipRow} -mx-4 mt-6 px-4 sm:mx-0 sm:mt-8 sm:px-0`}
            >
              {quickLinks.map((l) => (
                <Link key={l.href} href={l.href} className={t.chipOff}>
                  {l.label}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {sections.map((section, si) => (
        <section
          key={section.id}
          id={section.id}
          className={`border-t border-white/5 px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 ${
            si % 2 === 1 ? t.sectionBgAlt : ""
          }`}
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <h2 className={t.h2}>
                <span className="mr-2 inline-block" aria-hidden>
                  {section.emoji}
                </span>
                {section.title}
              </h2>
              {theme === "mehndi" ? (
                <div className={t.rule} aria-hidden>
                  <span className="h-1 w-6 rounded-full bg-gold/60" />
                  <span className="h-1 w-4 rounded-full bg-gold/40" />
                  <span className="h-1 w-6 rounded-full bg-gold/60" />
                </div>
              ) : (
                <div className={t.rule} aria-hidden />
              )}
            </Reveal>

            <div className={t.grid}>
              {section.services.map((item, idx) => (
                <Reveal key={item.name} delay={Math.min(idx * 0.025, 0.2)}>
                  <article className={t.card}>
                    <h3 className="font-display text-base leading-snug text-white sm:text-lg md:text-xl">
                      {item.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">
                      {item.blurb}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                      <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold-light">
                        {item.price}
                      </span>
                      {item.meta ? (
                        <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/65">
                          {item.meta}
                        </span>
                      ) : null}
                    </div>
                    <Link
                      href={`/book?service=${encodeURIComponent(item.name)}`}
                      className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-gold/45 bg-gold/10 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold transition hover:border-gold hover:bg-gold/18 sm:mt-5 sm:w-auto sm:px-6"
                    >
                      Book now
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-white/5 px-4 py-12 sm:px-6 md:px-8 md:py-16">
        <div className="mx-auto max-w-3xl px-1 text-center sm:px-0">
          <Reveal>
            <div className="mb-6 grid grid-cols-2 gap-2 sm:mb-8 sm:grid-cols-4">
              {["Certified", "Hygiene", "Premium", "On-time"].map((point) => (
                <span
                  key={point}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/85"
                >
                  {point}
                </span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-white/55 sm:text-base">
              {footerNote}
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/book?service=${encodeURIComponent("Consultation / Trial")}`}
                className="inline-flex min-h-[48px] w-full max-w-sm items-center justify-center rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-xs font-semibold uppercase tracking-[0.2em] text-black sm:w-auto sm:px-10"
              >
                Book consultation
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-[48px] w-full max-w-sm items-center justify-center rounded-full border border-white/25 bg-white/5 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 sm:w-auto"
              >
                Contact
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
