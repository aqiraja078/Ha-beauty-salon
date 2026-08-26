import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ThemeScope, type ScopeId } from "@/components/ui/ThemeScope";
import {
  ServicePageHero,
  type ServiceThemeId,
} from "@/components/services/ServicePageHero";
import { ServiceMenuCard } from "@/components/services/ServiceMenuCard";
import type { ServiceMenuSection } from "@/components/services/service-menu-mappers";

export type { ServiceThemeId };

type Props = {
  theme: ServiceThemeId;
  title: string;
  description: string;
  sections: ServiceMenuSection[];
};

const scopeOf: Record<ServiceThemeId, ScopeId> = {
  hair: "hair",
  makeup: "makeup",
  facial: "facial",
  bodySpa: "body-spa",
};

const grid = "mt-7 grid grid-cols-1 gap-4 sm:mt-9 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3";

const rule = "mt-4 w-24 border-t-[3px] border-double border-tint/60";

export function ServiceCategoryPage({
  theme,
  title,
  description,
  sections,
}: Props) {
  return (
    <ThemeScope scope={scopeOf[theme]}>
      <ServicePageHero
        theme={theme}
        title={title}
        description={description}
      />

      {sections.map((section, si) => (
        <section
          key={section.id}
          id={section.id}
          className={`border-t border-line px-4 py-8 sm:px-6 sm:py-16 md:px-8 md:py-20 ${
            si % 2 === 1 ? "bg-canvas-alt" : "bg-canvas"
          }`}
        >
          <div className="mx-auto max-w-7xl">
            <Reveal blur>
              <h2 className="flex items-center gap-3 font-display text-[1.7rem] leading-tight text-ink xs:text-3xl sm:text-4xl">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-tint-soft text-xl"
                  aria-hidden
                >
                  {section.emoji}
                </span>
                {section.title}
              </h2>
              <div className={rule} aria-hidden />
            </Reveal>

            <RevealGroup className={grid} stagger={0.05}>
              {section.services.map((item) => (
                <RevealItem key={item.name} className="h-full">
                  <ServiceMenuCard
                    name={item.name}
                    blurb={item.blurb}
                    price={item.price}
                    lengthPrices={item.lengthPrices}
                  />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      ))}
    </ThemeScope>
  );
}
