import { CartItem } from "./cart";

/**
 * Cart Items List component props
 */
export interface CartItemsListProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string, productName: string) => void;
}

/**
 * Cart Summary component props.
 * Shipping is not shown in cart; total = subtotal.
 */
export interface CartSummaryProps {
  subtotal: number;
  total: number;
}

