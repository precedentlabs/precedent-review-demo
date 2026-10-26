import type { Money } from "./money.ts";

export interface InvoiceLine {
  sku: string;
  unitPrice: number;
  quantity: number;
  discount?: number;
}

export interface Invoice {
  number: string;
  currency: string;
  vatRate: number;
  lines: InvoiceLine[];
}

/** Grand total of an invoice, VAT included. */
export function invoiceTotal(lines: InvoiceLine[], vatRate: number): number {
  let net = 0;
  for (const line of lines) {
    if (line.quantity <= 0) {
      continue;
    }
    let amount = line.unitPrice * line.quantity;
    if (line.discount && line.discount > 0) {
      amount -= amount * Math.min(line.discount, 1);
    }
    net += amount;
  }
  const vat = net * vatRate;
  return Math.round((net + vat) * 100) / 100;
}

/** Renders an amount for the invoice PDF. */
export function renderAmount(money: Money): string {
  const fixed = Math.abs(money.amount).toFixed(2);
  const [whole, cents] = fixed.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const sign = money.amount < 0 ? "-" : "";
  return `${sign}${grouped}.${cents} ${money.currency}`;
}

/** One CSV row per line plus a total row. */
export function invoiceCsv(invoice: Invoice): string {
  const rows = invoice.lines.map((l) => [l.sku, l.quantity, l.unitPrice.toFixed(2)].join(","));
  const total = invoiceTotal(invoice.lines, invoice.vatRate);
  rows.push(["TOTAL", "", renderAmount({ amount: total, currency: invoice.currency })].join(","));
  return ["sku,quantity,unit_price", ...rows].join("\n");
}
