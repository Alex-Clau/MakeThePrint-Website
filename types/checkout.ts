import { CartItem } from "./cart";

/**
 * Checkout Content component props
 */
export interface CheckoutContentProps {
  cartItems: CartItem[];
  userId: string;
}

import { AddressFormData } from "./address";

/**
 * Checkout Forms component props
 */
export interface CheckoutFormsProps {
  onFormDataChange: (data: {
    shipping: AddressFormData & { email?: string };
    saveAddress: boolean;
  }) => void;
}

import { CartItem } from "./cart";

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

import { CartItem } from "./cart";

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

