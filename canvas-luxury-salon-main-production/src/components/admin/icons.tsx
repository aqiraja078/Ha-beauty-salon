import type { SVGProps } from "react";

/**
 * Local stroke-icon set for the staff console. Inline SVG keeps the dashboard
 * dependency-free and lets every glyph inherit the console colour tokens.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconDashboard = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
  </Base>
);

export const IconHome = (p: IconProps) => (
  <Base {...p}>
    <path d="M3.5 10.5 12 3.5l8.5 7" />
    <path d="M5.5 9.8V20h13V9.8" />
    <path d="M9.8 20v-5.4h4.4V20" />
  </Base>
);

export const IconCalendar = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.2" y="5" width="17.6" height="16" rx="3" />
    <path d="M3.2 9.8h17.6M8 3v4M16 3v4" />
  </Base>
);

export const IconScissors = (p: IconProps) => (
  <Base {...p}>
    <circle cx="6" cy="6.5" r="2.6" />
    <circle cx="6" cy="17.5" r="2.6" />
    <path d="M8.3 7.9 20 18M20 6 8.3 16.1" />
  </Base>
);

export const IconSettings = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="3.1" />
    <path d="M19.4 14.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.11a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.11a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.11a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.11a1.7 1.7 0 0 0-1.49 1.03Z" />
  </Base>
);

export const IconInbox = (p: IconProps) => (
  <Base {...p}>
    <path d="M3.2 13.2h4.3l1.4 2.4h6.2l1.4-2.4h4.3" />
    <path d="M5.6 4.5h12.8l2.4 8.7v4.3a3 3 0 0 1-3 3H6.2a3 3 0 0 1-3-3v-4.3Z" />
  </Base>
);

export const IconClock = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="M12 7.3V12l3.1 1.9" />
  </Base>
);

export const IconCheckCircle = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="m8.3 12.2 2.5 2.5 4.9-5.1" />
  </Base>
);

export const IconXCircle = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="m9.3 9.3 5.4 5.4M14.7 9.3l-5.4 5.4" />
  </Base>
);

export const IconChevronDown = (p: IconProps) => (
  <Base {...p}>
    <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
  </Base>
);

export const IconArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M4.5 12h15M13.5 6l6 6-6 6" />
  </Base>
);

export const IconTrendUp = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 19.5V5M6 11l6-6 6 6" />
  </Base>
);

export const IconTrendDown = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4.5V19M6 13l6 6 6-6" />
  </Base>
);

export const IconLogout = (p: IconProps) => (
  <Base {...p}>
    <path d="M9.5 4.5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3.5" />
    <path d="M15.5 15.5 20 12l-4.5-3.5M9.5 12H20" />
  </Base>
);

export const IconSearch = (p: IconProps) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="6.8" />
    <path d="m16.2 16.2 4 4" />
  </Base>
);

export const IconMail = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.2" y="5.2" width="17.6" height="13.6" rx="3" />
    <path d="m4 8 8 5 8-5" />
  </Base>
);

export const IconPhone = (p: IconProps) => (
  <Base {...p}>
    <path d="M7.8 3.8h-2A2.3 2.3 0 0 0 3.5 6.4C4 13.8 10.2 20 17.6 20.5a2.3 2.3 0 0 0 2.6-2.3v-2l-4.3-1.4-1.9 1.9a13.6 13.6 0 0 1-5.2-5.2l1.9-1.9Z" />
  </Base>
);

export const IconClose = (p: IconProps) => (
  <Base {...p}>
    <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
  </Base>
);

export const IconMenu = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Base>
);

export const IconSparkle = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.5 13.9 9l5.6 2-5.6 2-1.9 5.5L10.1 13 4.5 11l5.6-2Z" />
  </Base>
);

export const IconTag = (p: IconProps) => (
  <Base {...p}>
    <path d="M19.5 12.8 12.7 19.6a2.2 2.2 0 0 1-3.1 0L4.4 14.4a2.2 2.2 0 0 1 0-3.1L11.2 4.5a2 2 0 0 1 1.3-.6H18a1.6 1.6 0 0 1 1.6 1.6v5.5a2 2 0 0 1-.1 1.3Z" />
    <circle cx="15.2" cy="8.8" r="1.15" fill="currentColor" stroke="none" />
  </Base>
);

/** Salon monogram crest used as the console mark. */
export function ConsoleCrest({ letter, ...p }: IconProps & { letter: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden {...p}>
      <circle
        cx="32"
        cy="32"
        r="24"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.5"
      />
      <circle
        cx="32"
        cy="32"
        r="19"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      <path
        d="M32 4.5c1.9 2.4 3.9 3.5 6.2 3.4-1 2.2-3.1 3.6-6.2 4.1-3.1-.5-5.2-1.9-6.2-4.1 2.3.1 4.3-1 6.2-3.4Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M13 38c1.5 6 5 10.4 10.5 13.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M51 38c-1.5 6-5 10.4-10.5 13.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <text
        x="32"
        y="41"
        textAnchor="middle"
        fontSize="24"
        fontFamily="var(--font-playfair), Georgia, serif"
        fill="currentColor"
      >
        {letter}
      </text>
    </svg>
  );
}
