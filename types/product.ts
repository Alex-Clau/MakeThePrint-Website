/**
 * Base product type matching the Supabase schema
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  material_options: string[];
  stock_quantity: number;
  dimensions?: string;
  print_time_hours?: number;
  weight_grams?: number;
  rating?: number;
  review_count?: number;
  image?: string;
}

/**
 * Product with image (for display purposes)
 */
export interface ProductWithImage extends Product {
  image: string;
}

/**
 * Product card display data
 */
export interface ProductCardData {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  featured?: boolean;
  rating?: number;
}

