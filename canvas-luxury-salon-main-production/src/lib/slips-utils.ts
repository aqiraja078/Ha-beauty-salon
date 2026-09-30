import type { Slip, SlipItem } from "@/lib/slips-types";

export type SlipTotals = {
  subtotal: number;
  discount: number;
  total: number;
  advance: number;
  balance: number;
  status: "paid" | "partial" | "unpaid";
};

function num(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function lineTotal(item: Pick<SlipItem, "qty" | "price">): number {
  return Math.round(num(item.qty) * num(item.price));
}

export function computeSlipTotals(
  slip: Pick<Slip, "items" | "discount" | "advance">
): SlipTotals {
  const subtotal = slip.items.reduce((sum, it) => sum + lineTotal(it), 0);
  const discount = Math.min(Math.round(num(slip.discount)), subtotal);
  const total = Math.max(0, subtotal - discount);
  const advance = Math.min(Math.round(num(slip.advance)), total);
  const balance = Math.max(0, total - advance);
  const status: SlipTotals["status"] =
    total > 0 && balance === 0 ? "paid" : advance > 0 ? "partial" : "unpaid";
  return { subtotal, discount, total, advance, balance, status };
}

export function formatRs(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString("en-PK")}`;
}

export function formatSlipDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const SLIP_STATUS_LABEL: Record<SlipTotals["status"], string> = {
  paid: "Paid",
  partial: "Advance received",
  unpaid: "Payment pending",
};

/** Digits only, Pakistan-aware (0300… → 92300…). Returns "" if it is not a usable number. */
export function whatsappDigits(phone: string): string {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = `92${d.slice(1)}`;
  return d.length >= 10 ? d : "";
}

export function buildSlipShareText(
  slip: Slip,
  salonName: string,
  link: string
): string {
  const t = computeSlipTotals(slip);
  const lines = [
    `Assalam o Alaikum ${slip.client.name || ""},`.replace(" ,", ","),
    ``,
    `Your slip from ${salonName}`,
    `Slip #: ${slip.number}`,
    `Date: ${formatSlipDate(slip.date)}`,
    slip.appointment ? `Appointment: ${slip.appointment}` : null,
    ``,
    ...slip.items
      .filter((i) => i.description.trim())
      .map(
        (i) =>
          `• ${i.description}${i.qty > 1 ? ` × ${i.qty}` : ""} — ${formatRs(lineTotal(i))}`
      ),
    ``,
    t.discount > 0 ? `Discount: -${formatRs(t.discount)}` : null,
    `Total: ${formatRs(t.total)}`,
    t.advance > 0 ? `Advance paid: ${formatRs(t.advance)}` : null,
    `Balance: ${formatRs(t.balance)}`,
    ``,
    `View / print your slip:`,
    link,
    ``,
    `Thank you for choosing ${salonName}!`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}
