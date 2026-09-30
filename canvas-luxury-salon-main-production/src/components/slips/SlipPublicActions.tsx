"use client";

import { useEffect } from "react";

export function SlipPublicActions({ autoPrint }: { autoPrint: boolean }) {
  useEffect(() => {
    if (!autoPrint) return;
    const t = window.setTimeout(() => window.print(), 600);
    return () => window.clearTimeout(t);
  }, [autoPrint]);

  return (
    <div className="mx-auto mb-5 flex w-full max-w-[794px] flex-wrap items-center justify-between gap-3 print:hidden">
      <p className="text-xs text-ink-soft">
        Tip: choose “Save as PDF” in the print window to download this slip.
      </p>
      <button type="button" onClick={() => window.print()} className="btn-primary min-h-[42px] px-6 text-[11px]">
        Print / Save PDF
      </button>
    </div>
  );
}
