import type { AddressFormData } from "./address";

/** Shipping address (optional fields + email). Single source: AddressFormData. */
export type OrderShippingAddress = Partial<AddressFormData> & { email?: string };

export interface Order {
  id: string;
  total_amount: number;
  shipping_address: OrderShippingAddress;
  created_at: string;
  order_items: OrderItem[];
};

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  material?: string;
  customizations?: Record<string, unknown>;
  products: {
    id: string;
    name: string;
    images?: string[];
  };
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
}

/**
 * Order Shipping Info component props
 */
export interface OrderShippingInfoProps {
  shippingAddress: Record<string, any>;
  trackingNumber?: string;
}


