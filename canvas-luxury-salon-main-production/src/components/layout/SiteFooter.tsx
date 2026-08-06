import Link from "next/link";
import type { SiteContent } from "@/lib/cms-types";
import { site as siteFallback } from "@/lib/site";

const exploreLinks = [
  { href: "/services/hair", label: "Hair" },
  { href: "/services/makeup", label: "Makeup" },
  { href: "/services/facial", label: "Facial" },
  { href: "/services/body-spa", label: "Wax & Body" },
  { href: "/services/nails", label: "Mani, pedi & nails" },
  { href: "/services/mehndi", label: "Mehndi" },
];

const linkClass =
  "group inline-flex items-center gap-1.5 py-0.5 text-sm transition hover:text-accent";

export function SiteFooter({ site: siteProp }: { site?: SiteContent }) {
  const site = siteProp ?? siteFallback;
  return (
    <footer className="relative overflow-hidden border-t border-line bg-canvas-alt">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px hairline" />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-2 md:px-8 lg:grid-cols-3 lg:gap-6">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element -- brand SVG logo */}
          <img src={site.logo} alt={site.name} className="h-10 w-auto sm:h-11" />
          <p className="mt-3 max-w-xs text-sm leading-snug text-ink-soft">
            {site.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition hover:border-accent/40 hover:text-accent"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
              </svg>
            </a>
            <a
              href={site.social.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition hover:border-accent/40 hover:text-accent"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M19.6 8.2a6.5 6.5 0 0 1-3.8-1.2v7.1a5.7 5.7 0 1 1-4.9-5.6v2.7a3 3 0 1 0 2.1 2.9V2.5h2.7c.2 1.6 1.3 3 2.8 3.7a6.3 6.3 0 0 0 3.1.7v2.8c-.7 0-1.4-.2-2-.5z" />
              </svg>
            </a>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition hover:border-accent/40 hover:text-accent"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:contents">
          <div>
            <p className="eyebrow">Services</p>
            <ul className="mt-2.5 space-y-0.5 text-ink-soft">
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-3" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Company</p>
            <ul className="mt-2.5 space-y-0.5 text-ink-soft">
              <li>
                <Link href="/how-to-book" className={linkClass}>
                  <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-3" />
                  How to book
                </Link>
              </li>
              <li>
                <Link href="/book" className={linkClass}>
                  <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-3" />
                  Book appointment
                </Link>
              </li>
              <li>
                <Link href="/offers" className={linkClass}>
                  <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-3" />
                  Offers
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkClass}>
                  <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-3" />
                  Contact
                </Link>
              </li>
            </ul>

            <div className="mt-5">
              <p className="eyebrow">Get in touch</p>
              <div className="mt-2.5 flex items-center gap-2">
                <a
                  href={`tel:+${site.phoneDigits}`}
                  aria-label={`Call ${site.phone}`}
                  title={site.phone}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent transition hover:bg-accent hover:text-accent-fg"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2.2 2.2z" />
                  </svg>
                </a>
                <a
                  href={`https://wa.me/${site.phoneDigits}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Chat on WhatsApp"
                  title="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C7E] transition hover:bg-[#25D366] hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                    <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4 0-.1-.2-.2-.5-.3zM12.1 21.2h0a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.9 9.9 0 0 1 12 2.1a9.9 9.9 0 0 1 9.9 9.9 9.9 9.9 0 0 1-9.8 9.2zm8.4-18.3A11.8 11.8 0 0 0 12 0 11.9 11.9 0 0 0 .2 11.9a11.8 11.8 0 0 0 1.6 5.9L0 24l6.3-1.7a11.9 11.9 0 0 0 5.7 1.4h0a11.9 11.9 0 0 0 11.9-11.9 11.8 11.8 0 0 0-3.5-8.4z" />
                  </svg>
                </a>
                <a
                  href={`mailto:${site.email}`}
                  aria-label={`Email ${site.email}`}
                  title={site.email}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent transition hover:bg-accent hover:text-accent-fg"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-line px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 md:px-8">
        <div className="mx-auto max-w-7xl text-center text-xs text-muted">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
