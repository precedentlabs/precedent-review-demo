import { cartTotal } from "./cart.ts";
import { formatMoney } from "./money.ts";

export interface Invoice {
  number: string;
  currency: string;
  vatRate: number;
  lines: { sku: string; unitPrice: number; quantity: number; discount?: number }[];
}

/** One CSV row per line plus a total row. */
export function invoiceCsv(invoice: Invoice): string {
  const rows = invoice.lines.map((l) => [l.sku, l.quantity, l.unitPrice.toFixed(2)].join(","));
  const total = cartTotal(invoice.lines, invoice.vatRate);
  rows.push(["TOTAL", "", formatMoney({ amount: total, currency: invoice.currency })].join(","));
  return ["sku,quantity,unit_price", ...rows].join("\n");
}
