import Image from "next/image";
import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Portfolio",
  description: `Gallery of work from ${site.name}.`,
};

const shots = [
  "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80",
  "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=800&q=80",
  "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80",
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
  "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&q=80",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80",
];

export default function PortfolioPage() {
  return (
    <div className="pt-24 sm:pt-28">
      <section className="px-4 pb-10 sm:px-6 md:px-8 md:pb-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Gallery</p>
            <h1 className="mt-3 font-display text-3xl text-white xs:text-4xl sm:text-5xl md:text-6xl">
              Portfolio
            </h1>
            <p className="mt-4 max-w-xl text-white/55">
              A glimpse of hair, skin, and makeup crafted for home services in
              Jhelum, Dina, and Gujrat.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 md:px-8 md:pb-24">
        <div className="mx-auto columns-1 gap-4 sm:columns-2 lg:columns-3">
          {shots.map((src, idx) => (
            <Reveal key={src} delay={(idx % 4) * 0.05} className="mb-4 break-inside-avoid">
              <div className="group relative overflow-hidden rounded-xl border border-white/10">
                <div
                  className={`relative w-full ${
                    idx % 3 === 0 ? "aspect-[3/4]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${site.name} gallery image ${idx + 1} of ${shots.length}`}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
