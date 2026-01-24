import { CartItem } from "./cart";

/**
 * Cart Items List component props
 */
export interface CartItemsListProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

/**
 * Cart Summary component props
 */
export interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
}

