/**
 * Order Item interface
 */
export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  material?: string;
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

