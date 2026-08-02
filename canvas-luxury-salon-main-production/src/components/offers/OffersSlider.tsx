"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { OfferCard, type OfferCardData } from "@/components/offers/OfferCard";

type Props = {
  items: OfferCardData[];
  featured?: boolean;
  contactHref?: string;
  contactLabel?: string;
};

function usePerPage() {
  const [perPage, setPerPage] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setPerPage(mq.matches ? 2 : 1);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return perPage;
}

export function OffersSlider({
  items,
  featured = false,
  contactHref,
  contactLabel,
}: Props) {
  const perPage = usePerPage();
  const reduce = useReducedMotion();
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(0);

  const pageCount = Math.max(1, Math.ceil(items.length / perPage));
  const activePage = Math.min(page, pageCount - 1);

  if (items.length === 0) return null;

  const start = activePage * perPage;
  const visible = items.slice(start, start + perPage);

  function go(next: number) {
    const clamped = ((next % pageCount) + pageCount) % pageCount;
    setDir(
      clamped > activePage || (activePage === pageCount - 1 && clamped === 0)
        ? 1
        : -1
    );
    setPage(clamped);
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`${activePage}-${perPage}`}
            custom={dir}
            initial={
              reduce
                ? false
                : { opacity: 0, x: dir >= 0 ? 40 : -40 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: dir >= 0 ? -40 : 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`grid gap-4 ${
              perPage === 2 ? "md:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {visible.map((offer) => (
              <div key={offer.id} className="h-full min-w-0">
                <OfferCard
                  offer={offer}
                  featured={featured}
                  contactHref={contactHref}
                  contactLabel={contactLabel}
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {pageCount > 1 ? (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Previous offers"
            onClick={() => go(activePage - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition hover:border-accent/40 hover:text-accent active:scale-[0.98]"
          >
            ←
          </button>

          <div className="flex gap-1">
            {Array.from({ length: pageCount }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Show offers page ${idx + 1}`}
                aria-current={idx === activePage ? "true" : undefined}
                onClick={() => {
                  setDir(idx > activePage ? 1 : -1);
                  setPage(idx);
                }}
                className="flex min-h-[44px] min-w-[36px] items-center justify-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    idx === activePage
                      ? "w-9 bg-accent"
                      : "w-2 bg-line hover:bg-muted"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next offers"
            onClick={() => go(activePage + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition hover:border-accent/40 hover:text-accent active:scale-[0.98]"
          >
            →
          </button>
        </div>
      ) : null}
    </div>
  );
}
