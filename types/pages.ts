/**
 * Page parameter types for Next.js routes
 */

/** Route with dynamic `id` param (e.g. product, order detail). */
export interface IdRouteParams {
  params: Promise<{ id: string }>;
}

export interface ProductPageParams extends IdRouteParams {}

/** Account order detail page. */
export interface OrderDetailPageParams extends IdRouteParams {}

/** Checkout confirmation page. */
export interface OrderConfirmationParams extends IdRouteParams {}

