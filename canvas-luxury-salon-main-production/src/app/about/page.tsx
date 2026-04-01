import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${site.name} — home beauty services in Jhelum, Dina, and Gujrat.`,
};

export default function AboutPage() {
  return (
    <div className="pt-24 sm:pt-28">
      <section className="px-4 pb-16 sm:px-6 md:px-8 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Our story</p>
            <h1 className="mt-3 max-w-3xl font-display text-3xl text-white xs:text-4xl sm:text-5xl md:text-6xl">
              Artistry rooted in care
            </h1>
          </Reveal>
          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-start">
            <Reveal className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80"
                alt="Team at work"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-white/70">
                {site.name} brings together senior stylists and makeup artists who
                share one goal: to make you feel unmistakably yourself — only more
                radiant. Our home-service setup across Jhelum, Dina, and Gujrat
                is designed to bring calm, premium care to your doorstep with
                professional lighting and hygiene standards.
              </p>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                From bridal trials to quick polish refreshes, every appointment is
                approached with the same patience, hygiene standards, and eye for
                detail. We invest in premium products and continuous training so
                your results look as beautiful in photographs as they do in person.
              </p>
              <Link
                href="/book"
                className="mt-10 inline-flex rounded-full bg-white px-10 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-nude-muted"
              >
                Plan your visit
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-white/[0.02] px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          {[
            { n: "10+", l: "Years collective expertise" },
            { n: "100%", l: "Consultation-first approach" },
            { n: "1:1", l: "Trials for major events" },
          ].map((stat, idx) => (
            <Reveal key={stat.l} delay={idx * 0.08}>
              <div className="glass-panel rounded-2xl p-8 text-center">
                <p className="font-display text-4xl text-gold">{stat.n}</p>
                <p className="mt-2 text-sm text-white/55">{stat.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
