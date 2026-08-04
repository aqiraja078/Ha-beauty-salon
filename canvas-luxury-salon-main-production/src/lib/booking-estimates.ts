import {
  BOOKING_AREAS,
  type BookingArea,
} from "@/lib/bookings-types";

const BRIDAL_PACKAGE_CAP_MINUTES = 480;

/** Keyword heuristics → estimated service duration (minutes). */
const RULES: { test: RegExp; minutes: number }[] = [
  { test: /bridal\s*package/i, minutes: 300 },
  { test: /bridal.*makeup|makeup.*bridal|barat|walima/i, minutes: 180 },
  { test: /party.*makeup|event.*makeup|makeup/i, minutes: 90 },
  { test: /mehndi|henna/i, minutes: 120 },
  { test: /keratin|smoothing|rebond/i, minutes: 150 },
  { test: /color|colour|highlight|balayage/i, minutes: 120 },
  { test: /hair\s*(cut|trim|style|styling)|blow\s*dry/i, minutes: 60 },
  { test: /facial|cleanup|glow|skin/i, minutes: 90 },
  { test: /wax|threading/i, minutes: 45 },
  { test: /spa|massage|polish|body/i, minutes: 75 },
  { test: /manicure|pedicure|nail|gel|extension/i, minutes: 75 },
  { test: /laser/i, minutes: 45 },
  { test: /consultation|trial/i, minutes: 30 },
];

const DEFAULT_MINUTES = 60;

export function estimateServiceMinutes(serviceName: string): number {
  const name = serviceName.trim();
  if (!name) return DEFAULT_MINUTES;
  for (const rule of RULES) {
    if (rule.test.test(name)) return rule.minutes;
  }
  return DEFAULT_MINUTES;
}

export function estimateDurationMinutes(
  services: string[],
  mode: "single" | "bridal"
): number {
  if (!services.length) return DEFAULT_MINUTES;
  if (mode === "single") {
    return estimateServiceMinutes(services[0]);
  }
  const sum = services.reduce(
    (acc, s) => acc + estimateServiceMinutes(s),
    0
  );
  return Math.min(sum, BRIDAL_PACKAGE_CAP_MINUTES);
}

export function travelMinutesForArea(area: BookingArea): number {
  return (
    BOOKING_AREAS.find((a) => a.id === area)?.travelMinutes ??
    BOOKING_AREAS[0].travelMinutes
  );
}

/** Human-readable estimate, e.g. "~2 hrs + ~35 min travel". */
export function formatDurationTravelLabel(
  durationMinutes: number,
  travelMinutes: number
): string {
  const duration = formatMinutesApprox(durationMinutes);
  if (!travelMinutes) return duration;
  return `${duration} + ${formatMinutesApprox(travelMinutes)} travel`;
}

export function formatMinutesApprox(minutes: number): string {
  if (minutes < 60) return `~${minutes} min`;
  const hours = minutes / 60;
  if (Number.isInteger(hours)) return `~${hours} hr${hours === 1 ? "" : "s"}`;
  const whole = Math.floor(hours);
  const rem = minutes % 60;
  if (whole === 0) return `~${rem} min`;
  return `~${whole} hr${whole === 1 ? "" : "s"} ${rem} min`;
}
