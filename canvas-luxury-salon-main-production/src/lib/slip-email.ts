import type { SiteContent } from "@/lib/cms-types";
import type { Slip } from "@/lib/slips-types";
import { SLIP_PAYMENT_LABELS } from "@/lib/slips-types";
import {
  SLIP_STATUS_LABEL,
  computeSlipTotals,
  formatRs,
  formatSlipDate,
  lineTotal,
} from "@/lib/slips-utils";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function slipEmailSubject(slip: Slip, site: SiteContent): string {
  return `Your slip ${slip.number} — ${site.name}`;
}

export function slipEmailText(slip: Slip, site: SiteContent, link: string): string {
  const t = computeSlipTotals(slip);
  return [
    `${site.name}`,
    `Slip ${slip.number} · ${formatSlipDate(slip.date)}`,
    ``,
    ...slip.items.map(
      (i) => `${i.description} x${i.qty} — ${formatRs(lineTotal(i))}`
    ),
    ``,
    t.discount ? `Discount: -${formatRs(t.discount)}` : "",
    `Total: ${formatRs(t.total)}`,
    t.advance ? `Advance: ${formatRs(t.advance)}` : "",
    `Balance: ${formatRs(t.balance)}`,
    ``,
    `View / print: ${link}`,
    ``,
    `${site.phone} | ${site.email}`,
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n");
}

export function slipEmailHtml(slip: Slip, site: SiteContent, link: string): string {
  const t = computeSlipTotals(slip);
  const rows = slip.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee">${esc(i.description)}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${esc(formatRs(lineTotal(i)))}</td></tr>`
    )
    .join("");
  return `<!DOCTYPE html><html><body style="font-family:Georgia,serif;line-height:1.55;color:#111;max-width:560px;margin:0 auto">
<h2 style="color:#8a6a2c;margin-bottom:2px">${esc(site.name)}</h2>
<p style="margin-top:0;color:#666">Slip <strong>${esc(slip.number)}</strong> · ${esc(formatSlipDate(slip.date))}</p>
<p>Assalam o Alaikum ${esc(slip.client.name)}, here is your slip.</p>
<table style="border-collapse:collapse;width:100%;font-size:14px">
<tr style="background:#f6efe0"><th style="text-align:left;padding:6px 10px">Service</th><th style="padding:6px 10px">Qty</th><th style="text-align:right;padding:6px 10px">Amount</th></tr>
${rows}
</table>
<table style="margin:14px 0 0 auto;font-size:14px">
${t.discount ? `<tr><td style="padding:2px 12px 2px 0;color:#666">Discount</td><td style="text-align:right">-${esc(formatRs(t.discount))}</td></tr>` : ""}
<tr><td style="padding:2px 12px 2px 0"><strong>Total</strong></td><td style="text-align:right"><strong>${esc(formatRs(t.total))}</strong></td></tr>
${t.advance ? `<tr><td style="padding:2px 12px 2px 0;color:#666">Advance</td><td style="text-align:right">${esc(formatRs(t.advance))}</td></tr>` : ""}
<tr><td style="padding:2px 12px 2px 0;color:#666">Balance</td><td style="text-align:right">${esc(formatRs(t.balance))}</td></tr>
</table>
<p style="font-size:13px;color:#666">${esc(SLIP_STATUS_LABEL[t.status])} · ${esc(SLIP_PAYMENT_LABELS[slip.paymentMethod])}</p>
<p><a href="${esc(link)}" style="display:inline-block;background:#C9A35B;color:#111;text-decoration:none;padding:10px 22px;border-radius:999px;font-family:Arial,sans-serif;font-size:13px;font-weight:bold">View / print slip</a></p>
<p style="font-size:13px;color:#555">${esc(site.name)}<br/>${esc(site.phone)} · ${esc(site.email)}</p>
</body></html>`;
}
