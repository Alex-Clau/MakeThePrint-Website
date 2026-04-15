/**
 * Page parameter types for Next.js routes
 */

/** Route with dynamic `id` param (e.g. product, order detail). */
export interface IdRouteParams {
  params: Promise<{ id: string }>;
}

export type ProductPageParams = IdRouteParams;

/** Account order detail page. */
export type OrderDetailPageParams = IdRouteParams;

/** Checkout confirmation page. */
export type OrderConfirmationParams = IdRouteParams;

