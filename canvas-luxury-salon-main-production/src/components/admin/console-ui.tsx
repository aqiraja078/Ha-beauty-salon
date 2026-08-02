"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { IconTrendDown, IconTrendUp } from "@/components/admin/icons";
import { initials, STATUS_TONES } from "@/lib/admin-console";
import type { BookingStatus } from "@/lib/bookings-types";

/** Smoothed mini chart — horizontal-tangent cubics keep it readable at 26px tall. */
export function Sparkline({
  data,
  className = "",
}: {
  data: number[];
  className?: string;
}) {
  const w = 78;
  const h = 26;
  const pad = 2;

  if (data.length < 2) {
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden>
        <line
          x1={pad}
          y1={h / 2}
          x2={w - pad}
          y2={h / 2}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const flat = max === min;
  const span = max - min || 1;
  const step = (w - pad * 2) / (data.length - 1);

  /* A flat series sits on the mid-line rather than the floor, so a quiet week
     still reads as a chart instead of a clipped edge. */
  const pts = data.map((v, i) => [
    pad + i * step,
    flat ? h / 2 : h - pad - ((v - min) / span) * (h - pad * 2),
  ]);

  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StatCard({
  icon,
  iconWrap,
  label,
  value,
  sub,
  trend,
  series,
  tone,
  active,
  onClick,
}: {
  icon: ReactNode;
  iconWrap: string;
  label: string;
  value: number;
  sub: string;
  trend: number;
  series: number[];
  tone: string;
  active: boolean;
  onClick: () => void;
}) {
  const down = trend < 0;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      aria-pressed={active}
      className={`console-card group flex flex-col p-5 text-left transition duration-300 ${
        active ? "border-accent/50 ring-2 ring-accent/15" : "hover:border-accent/35"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconWrap}`}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            {label}
          </p>
          <p className="mt-0.5 font-display text-3xl leading-none tabular-nums text-ink">
            {value}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-ink-soft">{sub}</p>

      <div className="mt-4 flex items-end justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-medium ${
            down ? "text-rose-500" : tone
          }`}
        >
          {down ? (
            <IconTrendDown className="h-3.5 w-3.5" />
          ) : (
            <IconTrendUp className="h-3.5 w-3.5" />
          )}
          {Math.abs(trend)} Today
        </span>
        <Sparkline data={series} className={`h-6 w-[78px] ${tone}`} />
      </div>
    </motion.button>
  );
}

export function StatusPill({ status }: { status: BookingStatus }) {
  const tone = STATUS_TONES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${tone.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} aria-hidden />
      {tone.label}
    </span>
  );
}

export function ClientAvatar({
  name,
  className = "h-9 w-9 text-[11px]",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold uppercase text-accent ${className}`}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
