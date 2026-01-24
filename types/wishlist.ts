/**
 * Wishlist Item component props
 */
export interface WishlistItemProps {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    stock_quantity?: number;
    rating?: number;
    review_count?: number;
  };
  onRemove: (productId: string) => void;
}

/**
 * Wishlist Content component props
 */
export interface WishlistContentProps {
  items: Array<{
    id: string;
    product_id: string;
    products: {
      id: string;
      name: string;
      price: number;
      images?: string[];
      stock_quantity?: number;
      rating?: number;
      review_count?: number;
    };
  }>;
  userId: string;
}

