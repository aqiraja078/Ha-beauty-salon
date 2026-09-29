"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { parseVideoEmbed, type GalleryItem } from "@/lib/gallery-types";

function PlayBadge({ small }: { small?: boolean }) {
  return (
    <span
      className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/70 bg-canvas/70 text-accent shadow-lift backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-fg ${
        small ? "h-10 w-10" : "h-14 w-14"
      }`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="ml-0.5 h-1/2 w-1/2" fill="currentColor">
        <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11-6.86a1 1 0 0 0 0-1.7l-11-6.86A1 1 0 0 0 8 5.14z" />
      </svg>
    </span>
  );
}

function Thumb({ item }: { item: GalleryItem }) {
  const alt = item.title || item.caption || "Gallery";
  if (item.type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- admin-managed external / uploaded media
      <img
        src={item.src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full object-cover transition duration-700 group-hover:scale-[1.04]"
      />
    );
  }

  const embed = parseVideoEmbed(item.src);
  const poster =
    item.poster ||
    (embed.kind === "youtube"
      ? `https://img.youtube.com/vi/${embed.id}/hqdefault.jpg`
      : "");

  return (
    <div className="relative aspect-[4/5] w-full bg-canvas-2">
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element -- video cover
        <img
          src={poster}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      ) : embed.kind === "file" ? (
        <video
          src={`${item.src}#t=0.1`}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          aria-label={alt}
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-surface to-canvas-2" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-canvas/60 via-transparent to-transparent" />
      <PlayBadge />
    </div>
  );
}

function LightboxMedia({ item }: { item: GalleryItem }) {
  const alt = item.title || item.caption || "Gallery";
  if (item.type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- admin-managed external / uploaded media
      <img
        src={item.src}
        alt={alt}
        className="max-h-[72vh] w-auto max-w-full rounded-xl object-contain shadow-lift-lg"
      />
    );
  }
  const embed = parseVideoEmbed(item.src);
  if (embed.kind === "youtube" || embed.kind === "vimeo") {
    const url =
      embed.kind === "youtube"
        ? `https://www.youtube.com/embed/${embed.id}?autoplay=1&rel=0`
        : `https://player.vimeo.com/video/${embed.id}?autoplay=1`;
    return (
      <iframe
        src={url}
        title={alt}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="aspect-video w-[min(92vw,1100px)] rounded-xl border-0 bg-black shadow-lift-lg"
      />
    );
  }
  return (
    <video
      key={item.id}
      src={item.src}
      poster={item.poster}
      controls
      autoPlay
      playsInline
      className="max-h-[72vh] w-auto max-w-full rounded-xl bg-black shadow-lift-lg"
    />
  );
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<number | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const i of items) if (i.category) set.add(i.category);
    return ["All", ...Array.from(set)];
  }, [items]);

  const visible = useMemo(
    () => (category === "All" ? items : items.filter((i) => i.category === category)),
    [items, category]
  );

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setActive((cur) =>
        cur === null || visible.length === 0
          ? cur
          : (cur + dir + visible.length) % visible.length
      ),
    [visible.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, close, step]);

  const current = active !== null ? visible[active] : null;

  return (
    <>
      {categories.length > 2 ? (
        <div
          className="mb-6 flex flex-wrap justify-center gap-2 sm:mb-9"
          role="tablist"
          aria-label="Gallery categories"
        >
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              onClick={() => {
                setCategory(c);
                setActive(null);
              }}
              className={`min-h-[38px] rounded-full border px-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
                category === c
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-line bg-surface/60 text-ink-soft hover:border-accent/60 hover:text-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      ) : null}

      <div className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        {visible.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Open ${item.type}: ${item.title || item.caption || "gallery item"}`}
            className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-line bg-surface text-left shadow-soft transition duration-500 hover:border-accent/60 hover:shadow-lift sm:mb-4"
          >
            <Thumb item={item} />
            {item.title ? (
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas/90 via-canvas/50 to-transparent px-3 pb-3 pt-10 text-xs font-medium text-ink opacity-0 transition duration-300 group-hover:opacity-100 sm:text-sm">
                {item.title}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {current ? (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black/90 px-3 py-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={current.title || "Gallery viewer"}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface/80 text-ink transition hover:border-accent hover:text-accent sm:right-6 sm:top-6"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {visible.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface/80 text-ink transition hover:border-accent hover:text-accent sm:left-6"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface/80 text-ink transition hover:border-accent hover:text-accent sm:right-6"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            ) : null}

            <div
              className="flex max-w-full flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <LightboxMedia item={current} />
              {current.title || current.caption ? (
                <div className="mt-4 max-w-2xl text-center">
                  {current.title ? (
                    <p className="font-display text-lg text-accent sm:text-xl">
                      {current.title}
                    </p>
                  ) : null}
                  {current.caption ? (
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                      {current.caption}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-muted">
                {(active ?? 0) + 1} / {visible.length}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
