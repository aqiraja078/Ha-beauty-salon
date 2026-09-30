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

type SlipLike = Pick<
  Slip,
  | "number"
  | "date"
  | "client"
  | "appointment"
  | "staff"
  | "items"
  | "discount"
  | "advance"
  | "paymentMethod"
  | "notes"
>;

const GOLD = "#C9A35B";
const GOLD_DARK = "#8a6a2c";

const STATUS_STYLE = {
  paid: { bg: "#e7f4ea", fg: "#1e6b35" },
  partial: { bg: "#fbf0d9", fg: "#8a6a2c" },
  unpaid: { bg: "#fbe6e3", fg: "#a3362a" },
} as const;

/**
 * The printable slip. Always rendered on white "paper" (even in the dark admin / site
 * theme) so it prints and screenshots cleanly. Pure markup — no hooks — so both the
 * admin live preview and the public /slip page use it.
 */
export function SlipDocument({
  slip,
  site,
}: {
  slip: SlipLike;
  site: Pick<SiteContent, "name" | "logo" | "phone" | "email" | "address">;
}) {
  const t = computeSlipTotals(slip);
  const items = slip.items.filter((i) => i.description.trim());
  const status = STATUS_STYLE[t.status];
  const label = "text-[10px] font-semibold uppercase tracking-[0.18em]";

  return (
    <article
      className="mx-auto w-full max-w-[794px] rounded-2xl bg-white p-6 text-[#1a1a1a] shadow-[0_18px_50px_-20px_rgba(0,0,0,0.6)] print:max-w-none print:rounded-none print:p-0 print:shadow-none sm:p-10"
      style={{ borderTop: `6px solid ${GOLD}` }}
    >
      <header className="flex items-stretch justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 text-left text-[12px] leading-snug text-[#444]">
          <p className="font-display text-base font-semibold text-[#1a1a1a]">
            {site.name}
          </p>
          {site.address ? <p>{site.address}</p> : null}
          <p>{site.phone}</p>
          <p className="break-all">{site.email}</p>
        </div>
        <div className="flex shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- printable brand logo */}
          <img
            src={site.logo || "/logo-adaa.png"}
            alt={site.name}
            className="h-20 w-auto sm:h-24"
          />
        </div>
      </header>

      <div
        className="mt-6 flex flex-wrap items-end justify-between gap-3 border-y py-3"
        style={{ borderColor: GOLD }}
      >
        <h2
          className="font-display text-2xl tracking-[0.2em]"
          style={{ color: GOLD_DARK }}
        >
          SLIP
        </h2>
        <div className="text-right text-[13px]">
          <p>
            <span className="text-[#777]">Slip #</span>{" "}
            <strong>{slip.number || "—"}</strong>
          </p>
          <p>
            <span className="text-[#777]">Date</span>{" "}
            <strong>{formatSlipDate(slip.date)}</strong>
          </p>
        </div>
      </div>

      <section className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <p className={label} style={{ color: GOLD_DARK }}>
            Billed to
          </p>
          <p className="mt-1.5 text-base font-semibold">
            {slip.client.name || "—"}
          </p>
          <div className="mt-0.5 space-y-0.5 text-[13px] text-[#444]">
            {slip.client.phone ? <p>{slip.client.phone}</p> : null}
            {slip.client.email ? <p className="break-all">{slip.client.email}</p> : null}
            {slip.client.address ? <p>{slip.client.address}</p> : null}
            {slip.client.idCard ? <p>CNIC: {slip.client.idCard}</p> : null}
          </div>
        </div>
        <div>
          <p className={label} style={{ color: GOLD_DARK }}>
            Service details
          </p>
          <div className="mt-1.5 space-y-0.5 text-[13px] text-[#444]">
            {slip.appointment ? (
              <p>
                <span className="text-[#777]">Appointment:</span> {slip.appointment}
              </p>
            ) : null}
            {slip.staff ? (
              <p>
                <span className="text-[#777]">Artist / staff:</span> {slip.staff}
              </p>
            ) : null}
            <p>
              <span className="text-[#777]">Payment:</span>{" "}
              {SLIP_PAYMENT_LABELS[slip.paymentMethod]}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 overflow-hidden rounded-lg border border-[#eadfc6]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr style={{ background: "#f6efe0", color: GOLD_DARK }}>
              <th className={`${label} px-3 py-2.5 text-left`}>Service</th>
              <th className={`${label} w-12 px-2 py-2.5 text-center`}>Qty</th>
              <th className={`${label} hidden px-3 py-2.5 text-right sm:table-cell`}>
                Rate
              </th>
              <th className={`${label} px-3 py-2.5 text-right`}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-5 text-center text-[#888]">
                  No items yet
                </td>
              </tr>
            ) : (
              items.map((i) => (
                <tr key={i.id} className="border-t border-[#f0e8d6]">
                  <td className="px-3 py-2.5 align-top">{i.description}</td>
                  <td className="px-2 py-2.5 text-center align-top">{i.qty}</td>
                  <td className="hidden px-3 py-2.5 text-right align-top sm:table-cell">
                    {formatRs(i.price)}
                  </td>
                  <td className="px-3 py-2.5 text-right align-top font-medium">
                    {formatRs(lineTotal(i))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0 flex-1 basis-56">
          <span
            className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ background: status.bg, color: status.fg }}
          >
            {SLIP_STATUS_LABEL[t.status]}
          </span>
          {slip.notes ? (
            <div className="mt-3">
              <p className={label} style={{ color: GOLD_DARK }}>
                Notes
              </p>
              <p className="mt-1 whitespace-pre-line text-[13px] text-[#444]">
                {slip.notes}
              </p>
            </div>
          ) : null}
        </div>

        <dl className="w-full max-w-[16rem] space-y-1.5 text-[13px] sm:ml-auto">
          <div className="flex justify-between">
            <dt className="text-[#777]">Subtotal</dt>
            <dd>{formatRs(t.subtotal)}</dd>
          </div>
          {t.discount > 0 ? (
            <div className="flex justify-between">
              <dt className="text-[#777]">Discount</dt>
              <dd>-{formatRs(t.discount)}</dd>
            </div>
          ) : null}
          <div
            className="flex justify-between border-t pt-1.5 text-[15px] font-semibold"
            style={{ borderColor: GOLD }}
          >
            <dt>Total</dt>
            <dd>{formatRs(t.total)}</dd>
          </div>
          {t.advance > 0 ? (
            <div className="flex justify-between">
              <dt className="text-[#777]">Advance paid</dt>
              <dd>{formatRs(t.advance)}</dd>
            </div>
          ) : null}
          <div
            className="flex justify-between rounded-md px-2 py-1.5 font-semibold"
            style={{ background: "#f6efe0", color: GOLD_DARK }}
          >
            <dt>Balance due</dt>
            <dd>{formatRs(t.balance)}</dd>
          </div>
        </dl>
      </div>

      <footer
        className="mt-8 border-t pt-4 text-center text-[12px] text-[#777]"
        style={{ borderColor: "#eadfc6" }}
      >
        <p className="font-display text-sm" style={{ color: GOLD_DARK }}>
          Thank you for choosing {site.name}
        </p>
        <p className="mx-auto mt-1 max-w-xl leading-relaxed">
          Booking must be confirmed within 24 hours. In case of cancellation after 24 hours, the advance payment will be non-refundable.
        </p>
      </footer>
    </article>
  );
}
