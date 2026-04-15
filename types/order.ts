import type { AddressFormData } from "./address";

/** Shipping address (optional fields + email). Single source: AddressFormData. */
export type OrderShippingAddress = Partial<AddressFormData> & { email?: string };

export interface Order {
  id: string;
  total_amount: number;
  shipping_address: OrderShippingAddress;
  created_at: string;
  order_items: OrderItem[];
  tracking_number?: string | null;
  /** Order lifecycle (e.g. pending, confirmed). */
  status?: string;
  /** Set when Stripe payment succeeded and order marked paid (Supabase). */
  payment_status?: string;
  /** Set after buyer confirmation email is accepted by Resend (Supabase). */
  confirmation_email_sent_at?: string | null;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  material?: string;
  customizations?: Record<string, unknown>;
  /** Null when the product row was removed but the line item is kept. */
  products: {
    id: string;
    name: string;
    images?: string[];
  } | null;
}

/**
 * Order Items List component props
 */
export interface OrderItemsListProps {
  items: OrderItem[];
}

/**
 * Order Detail Header component props
 */
export interface OrderDetailHeaderProps {
  orderId: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  /** Sum of line totals (price × quantity); shipping = total − subtotal. */
  subtotal: number;
}

/**
 * Order Shipping Info component props
 */
export interface OrderShippingInfoProps {
  shippingAddress: OrderShippingAddress;
  trackingNumber?: string;
}


