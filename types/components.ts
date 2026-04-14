import { Product, ProductCardData } from "./product";

/** Same shape as list/grid product data — single source of truth in `types/product`. */
export type ProductCardProps = ProductCardData;

/**
 * ProductDetailForm component props
 */
export interface ProductDetailFormProps {
  product: Product;
  previewText?: string; // Text from the editable preview box
  onPreviewChange?: (preview: {
    text: string;
    font: string;
    color: string;
    size: string; // Admin-defined size label (e.g. "10cm")
  }) => void;
  averageRating?: number;
  totalReviews?: number;
  isInWishlist?: boolean;
}

/**
 * AnimatedProductPageContent component props
 */
export interface AnimatedProductPageContentProps {
  product: Product & { image: string };
  averageRating?: number;
  totalReviews?: number;
  isInWishlist?: boolean;
}

/**
 * ProductListItem component props
 */
export interface ProductListItemProps {
  product: ProductCardData;
  isInWishlist?: boolean;
}

/**
 * ProductsContent component props
 */
export interface ProductsContentProps {
  products: ProductCardData[];
}

/**
 * ViewToggle component props
 */
export interface ViewToggleProps {
  viewMode: "grid" | "list";
  onViewChange: (mode: "grid" | "list") => void;
}

