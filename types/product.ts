/**
 * Size–price entry defined by admin for preset products
 */
export interface SizePriceEntry {
  size: string;
  price: number;
}

/**
 * Custom product configuration (preset category)
 */
export interface CustomProductConfig {
  colors?: string[];
  fonts?: string[];
  defaultFont?: string;
  sizePrices?: SizePriceEntry[] | Record<string, number>;
  isOutdoor?: boolean;
  isLedStrip?: boolean;
  isColor?: boolean;
  /** Add-on price (RON) when customer selects Outdoor */
  outdoorPrice?: number;
  /** Add-on price (RON) when customer selects LED strip */
  ledStripPrice?: number;
  /** Add-on price (RON) when customer selects Color */
  colorPrice?: number;
  /** Price per character (RON); total ramps up as customer types. 0 = no per-character pricing. */
  pricePerCharacter?: number;
  [key: string]: unknown;
}

/**
 * Contact options for inquire-category products (e.g. WhatsApp).
 */
export interface InquireContactConfig {
  whatsappNumber: string;
  whatsappMessage?: string;
}

/**
 * Base product type matching the Supabase schema
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  product_type?: "custom" | "seasonal";
  category?: "preset" | "inquire" | "finished";
  custom_config?: CustomProductConfig | InquireContactConfig;
  featured?: boolean;
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
  isInWishlist?: boolean;
}

