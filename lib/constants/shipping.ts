/**
 * Shipping rules: single source for cart and checkout.
 */

/** Subtotal (RON) above which shipping is free. */
export const FREE_SHIPPING_THRESHOLD_RON = 500;

/** Shipping fee (RON) when below free-shipping threshold. */
export const SHIPPING_FEE_RON = 15;

/**
 * Returns shipping cost in RON for a given subtotal.
 */
export function getShippingCost(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD_RON ? 0 : SHIPPING_FEE_RON;
}
