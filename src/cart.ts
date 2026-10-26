export interface CartItem {
  sku: string;
  unitPrice: number;
  quantity: number;
  discount?: number; // 0..1
}

/** Total of a cart: discounted line totals plus tax, rounded to cents. */
export function cartTotal(items: CartItem[], taxRate: number): number {
  let subtotal = 0;
  for (const item of items) {
    if (item.quantity <= 0) {
      continue;
    }
    let line = item.unitPrice * item.quantity;
    if (item.discount && item.discount > 0) {
      line -= line * Math.min(item.discount, 1);
    }
    subtotal += line;
  }
  const tax = subtotal * taxRate;
  return Math.round((subtotal + tax) * 100) / 100;
}
