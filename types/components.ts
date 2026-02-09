import { Product, ProductCardData } from "./product";

/**
 * ProductCard component props
 */
export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  featured?: boolean;
  rating?: number;
  review_count?: number;
}

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
}

/**
 * AnimatedProductPageContent component props
 */
export interface AnimatedProductPageContentProps {
  product: Product & { image: string };
}

/**
 * AnimatedProductImage component props
 */
export interface AnimatedProductImageProps {
  src: string;
  alt: string;
}

/**
 * ProductListItem component props
 */
export interface ProductListItemProps {
  product: ProductCardData;
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

