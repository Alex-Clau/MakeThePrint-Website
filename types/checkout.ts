import { CartItem } from "./cart";

import { AddressFormData } from "./address";

/**
 * Checkout Content component props
 */
export interface CheckoutContentProps {
  cartItems: CartItem[];
  userId: string;
  savedAddresses?: AddressFormData[];
  userEmail?: string;
}

/**
 * Checkout Forms component props
 */
export interface CheckoutFormsProps {
  onFormDataChange: (data: {
    shipping: AddressFormData & { email?: string };
    saveAddress: boolean;
  }) => void;
  savedAddresses?: AddressFormData[];
  userEmail?: string;
}

/**
 * Order Summary component props
 */
export interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

/**
 * Order Item component props
 */
export interface OrderItemProps {
  item: CartItem;
}

/**
 * Stripe Payment Form component props
 */
export interface StripePaymentFormProps {
  clientSecret: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isSubmitting?: boolean;
}

/**
 * Stripe Payment Wrapper component props
 */
export interface StripePaymentWrapperProps {
  clientSecret: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isSubmitting?: boolean;
}

