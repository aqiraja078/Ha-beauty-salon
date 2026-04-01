import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:gap-8 sm:px-6 md:grid-cols-2 md:px-8 md:py-10 lg:grid-cols-4">
        <Reveal delay={0}>
          <p className="font-display text-xl tracking-wide text-white sm:text-2xl">
            {site.name}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            {site.description}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold">
            Explore
          </p>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            <li>
              <Link
                href="/services"
                className="inline-block min-h-[44px] py-2 hover:text-white"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/portfolio"
                className="inline-block min-h-[44px] py-2 hover:text-white"
              >
                Portfolio
              </Link>
            </li>
            <li>
              <Link
                href="/book"
                className="inline-block min-h-[44px] py-2 hover:text-white"
              >
                Book Appointment
              </Link>
            </li>
            <li>
              <Link
                href="/admin/login"
                className="inline-block min-h-[44px] py-2 hover:text-white/40"
              >
                Staff
              </Link>
            </li>
          </ul>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold">
            Contact
          </p>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="break-all hover:text-white"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:+${site.phoneDigits}`} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li className="max-w-[min(100%,280px)] leading-relaxed">
              {site.address}
            </li>
          </ul>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold">
            Follow
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-4 py-2.5 text-xs uppercase tracking-wider text-white/70 transition hover:scale-[1.02] hover:border-gold/50 hover:text-gold active:scale-[0.98]"
            >
              Instagram
            </a>
            <a
              href={site.social.tiktok}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-4 py-2.5 text-xs uppercase tracking-wider text-white/70 transition hover:scale-[1.02] hover:border-gold/50 hover:text-gold active:scale-[0.98]"
            >
              TikTok
            </a>
          </div>
        </Reveal>
      </div>
      <div className="border-t border-white/5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-xs text-white/40">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
