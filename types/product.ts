/**
 * Custom product configuration
 */
export interface CustomProductConfig {
  colors?: string[];
  defaultFont?: string;
  [key: string]: any;
}

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
  product_type?: "standard" | "custom_letters";
  custom_config?: CustomProductConfig;
  image?: string;
  images?: string[];
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

