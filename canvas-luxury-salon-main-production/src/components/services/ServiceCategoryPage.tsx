import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import type { ServiceHeroContent } from "@/components/services/ServicePageHero";
import { ThemeScope, type ScopeId } from "@/components/ui/ThemeScope";
import {
  ServicePageHero,
  type ServiceThemeId,
} from "@/components/services/ServicePageHero";
import { ServiceMenuCard } from "@/components/services/ServiceMenuCard";
import type { ServiceMenuSection } from "@/components/services/service-menu-mappers";
import { serviceCardImage } from "@/lib/service-card-images";

export type { ServiceThemeId };

type Props = {
  theme: ServiceThemeId;
  title: string;
  description: string;
  sections: ServiceMenuSection[];
  hero?: ServiceHeroContent;
  footerNote?: string;
};

const scopeOf: Record<ServiceThemeId, ScopeId> = {
  hair: "hair",
  makeup: "makeup",
  facial: "facial",
  bodySpa: "body-spa",
};

const gridDefault =
  "mt-7 grid grid-cols-1 gap-5 sm:mt-9 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6";
const gridMakeupEvent =
  "mt-7 grid grid-cols-1 gap-5 sm:mt-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6";
const gridMakeupBridal =
  "mt-7 grid grid-cols-1 gap-5 sm:mt-9 sm:grid-cols-2 lg:gap-6";

const rule = "mt-4 w-24 border-t-[3px] border-double border-accent/50";

function cardVariantFor(
  theme: ServiceThemeId,
  sectionId: string,
  name: string
): "default" | "luxury" | "luxury-wide" {
  if (theme !== "makeup") return "luxury";
  if (sectionId === "event-makeup") return "luxury";
  if (
    sectionId === "bridal-barat-makeup" &&
    (name.includes("Signature") || name.includes("Bridal Makeup Barat"))
  ) {
    return "luxury-wide";
  }
  if (sectionId.startsWith("bridal")) return "luxury";
  return "luxury";
}

export function ServiceCategoryPage({
  theme,
  title,
  description,
  sections,
  hero,
  footerNote,
}: Props) {
  return (
    <ThemeScope scope={scopeOf[theme]}>
      <ServicePageHero
        theme={theme}
        title={title}
        description={description}
        hero={hero}
      />

      {sections.map((section, si) => (
        <section
          key={section.id}
          id={section.id}
          className={`border-t border-line/70 px-4 py-8 sm:px-6 sm:py-16 md:px-8 md:py-20 ${
            si % 2 === 1 ? "bg-canvas-alt" : "bg-canvas"
          }`}
        >
          <div className="mx-auto max-w-7xl">
            <Reveal blur>
              <h2 className="flex items-center gap-3 font-display text-[1.7rem] leading-tight text-accent xs:text-3xl sm:text-4xl">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-accent/35 bg-surface text-xl"
                  aria-hidden
                >
                  {section.emoji}
                </span>
                {section.title}
              </h2>
              <div className={rule} aria-hidden />
            </Reveal>

            <RevealGroup
              className={
                theme === "makeup" && section.id === "event-makeup"
                  ? gridMakeupEvent
                  : theme === "makeup"
                    ? gridMakeupBridal
                    : gridDefault
              }
              stagger={0.05}
            >
              {section.services.map((item, ii) => (
                <RevealItem key={item.name} className="h-full">
                  <ServiceMenuCard
                    imageSrc={item.image || serviceCardImage(theme, item.name, ii)}
                    name={item.name}
                    blurb={item.blurb}
                    price={item.price}
                    lengthPrices={item.lengthPrices}
                    discount={item.discount}
                    index={ii + 1}
                    variant={cardVariantFor(theme, section.id, item.name)}
                  />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      ))}

      {footerNote?.trim() ? (
        <section className="border-t border-line/70 bg-canvas px-4 py-8 sm:px-6 sm:py-12 md:px-8">
          <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-ink-soft sm:text-base">
            {footerNote}
          </p>
        </section>
      ) : null}
    </ThemeScope>
  );
}
