/**
 * Cart-related types
 */

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  material?: string;
  customizations?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  products: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    stock_quantity?: number;
  };
}

export interface CartContentProps {
  items: CartItem[];
  userId: string;
}

