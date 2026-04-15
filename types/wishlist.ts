/** Product summary embedded on wishlist rows (from Supabase join). */
export interface WishlistProductSummary {
  id: string;
  name: string;
  price: number;
  images?: string[];
  rating?: number;
  review_count?: number;
}

/** One wishlist row after mapping from DB. */
export interface WishlistRow {
  id: string;
  product_id: string;
  products: WishlistProductSummary;
}

/**
 * Wishlist Item component props
 */
export interface WishlistItemProps {
  product: WishlistProductSummary;
  onRemove: (productId: string, productLabel: string) => void;
}

/**
 * Wishlist Content component props
 */
export interface WishlistContentProps {
  items: WishlistRow[];
  userId: string;
}

