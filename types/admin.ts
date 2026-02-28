/**
 * Admin route and component prop types
 */

/** Admin products list page (searchParams). */
export interface AdminProductsPageProps {
  searchParams: Promise<{ type?: string; category?: string }>;
}

/** Admin new product page (searchParams). */
export interface NewProductPageProps {
  searchParams: Promise<{ type?: string }>;
}

/** Admin edit product page (params). */
export interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

/** Admin order detail page (params). */
export interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

/** Order status form component props. */
export interface OrderStatusFormProps {
  orderId: string;
  currentStatus: string;
  currentTracking?: string;
}
