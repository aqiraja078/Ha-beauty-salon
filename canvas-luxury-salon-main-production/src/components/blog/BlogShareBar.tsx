"use client";

import { useState } from "react";

type Props = {
  title: string;
  url: string;
};

export function BlogShareBar({ title, url }: Props) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  const link =
    "text-[11px] font-medium tracking-[0.12em] text-ink-soft underline-offset-4 transition hover:text-accent hover:underline";

  return (
    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
      <span className="font-display text-sm italic text-muted">Pass it on</span>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={link}
      >
        WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={link}
      >
        Facebook
      </a>
      <button type="button" onClick={() => void copyLink()} className={link}>
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
