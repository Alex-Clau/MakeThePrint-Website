/**
 * Custom product configuration
 */
export interface CustomProductConfig {
  colors?: string[];
  defaultFont?: string;
  [key: string]: any;
}

/**
 * Keychain product configuration
 */
export interface KeychainConfig {
  whatsappNumber: string; // Phone number for WhatsApp inquiry (format: 1234567890)
  whatsappMessage?: string; // Pre-filled message template
}

/**
 * Base product type matching the Supabase schema
 */
export interface Product {
  id: string;
  name: string;
  /** Romanian display name; shown when locale is ro, fallback to name */
  name_ro?: string | null;
  description: string;
  price: number;
  material_options: string[];
  product_type?: "custom" | "seasonal";
  category?: string; // 'indoor_wall_letters', 'outdoor_wall_letters', 'keychains', 'seasonal_decor'
  custom_config?: CustomProductConfig | KeychainConfig;
  featured?: boolean;
  seasonal?: boolean;
  image?: string;
  images?: string[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Product card display data with calculated rating
 */
export interface ProductCardData {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  featured?: boolean;
  rating?: number; // Calculated from product_reviews, not stored in products table
  review_count?: number; // Calculated from product_reviews, not stored in products table
}

