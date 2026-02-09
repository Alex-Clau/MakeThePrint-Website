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
  category?: "preset" | "inquire" | "finished";
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

