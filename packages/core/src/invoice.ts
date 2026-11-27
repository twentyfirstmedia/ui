/**
 * Invoice sums: rounding per line and per VAT rate, shared by InvoiceEditor and InvoicePreview so
 * the editor, the preview and a server that runs the same function agree to the cent.
 */
import type { InvoiceTotals, InvoiceTotalsLine } from "./components/types.js";

/** Rounds to cents, half away from zero (as invoices do). */
export function roundMoney(n: number): number {
  const r = Math.round(Math.abs(n) * 100 + 1e-9) / 100;
  return n < 0 ? -r : r;
}

/**
 * The sums of an invoice: each line's net (quantity × price, less its discount) rounded to cents;
 * per VAT rate the base (less the invoice discount) and its VAT, each rounded once per rate; then
 * net, VAT and total.
 */
export function invoiceTotals(
  lines: InvoiceTotalsLine[],
  o: { discount?: number } = {},
): InvoiceTotals {
  const nets = lines.map((l) =>
    roundMoney((l.quantity || 0) * (l.price || 0) * (1 - (l.discount || 0) / 100)),
  );
  const subtotal = roundMoney(nets.reduce((a, b) => a + b, 0));
  const byRate = new Map<number, number>();
  lines.forEach((l, i) => byRate.set(l.vat || 0, (byRate.get(l.vat || 0) || 0) + (nets[i] ?? 0)));
  const off = 1 - (o.discount || 0) / 100;
  const rates = [...byRate.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([rate, sum]) => {
      const base = roundMoney(sum * off);
      return { rate, net: base, vat: roundMoney((base * rate) / 100) };
    });
  const net = roundMoney(rates.reduce((a, r) => a + r.net, 0));
  const vat = roundMoney(rates.reduce((a, r) => a + r.vat, 0));
  return {
    lines: nets,
    subtotal,
    discount: roundMoney(subtotal - net),
    net,
    rates,
    vat,
    total: roundMoney(net + vat),
  };
}
