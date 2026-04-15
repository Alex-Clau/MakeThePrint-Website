/**
 * Cart-related types
 */

export interface CartCustomizations {
  text?: string;
  font?: string;
  color?: string;
  size?: string;
  characterCount?: number;
  totalPrice?: number;
  isOutdoor?: boolean;
  isLedStrip?: boolean;
  isColor?: boolean;
  [key: string]: unknown;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  material?: string;
  customizations?: CartCustomizations;
  resolved_unit_price?: number;
  created_at?: string;
  updated_at?: string;
  products: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    category?: string;
    custom_config?: unknown;
  };
}

export interface CartContentProps {
  items: CartItem[];
}

