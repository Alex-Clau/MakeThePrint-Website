import type { CartItem } from "@/types/cart";

export function getCartUnitPrice(item: CartItem): number {
  if (item.resolved_unit_price != null) {
    return item.resolved_unit_price;
  }

  if (item.customizations?.totalPrice != null) {
    return item.customizations.totalPrice;
  }

  return item.products?.price ?? 0;
}

export function getCartLineTotal(item: CartItem): number {
  return getCartUnitPrice(item) * item.quantity;
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + getCartLineTotal(item), 0);
}
