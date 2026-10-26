export interface Money {
  amount: number;
  currency: string;
}

/** Formats an amount with two decimals and the currency code, e.g. "1,234.50 EUR". */
export function formatMoney(value: Money): string {
  const fixed = Math.abs(value.amount).toFixed(2);
  const [whole, cents] = fixed.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const sign = value.amount < 0 ? "-" : "";
  return `${sign}${grouped}.${cents} ${value.currency}`;
}
