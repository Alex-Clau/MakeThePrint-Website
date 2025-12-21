import { Product } from "./product";

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
}

/**
 * ProductDetailForm component props
 */
export interface ProductDetailFormProps {
  product: Product;
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

