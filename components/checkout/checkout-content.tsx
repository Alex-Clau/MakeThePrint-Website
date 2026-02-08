"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { CheckoutForms } from "./checkout-forms";
import { OrderSummary } from "./order-summary";
import { StripePaymentWrapper } from "./stripe-payment-wrapper";
import { CartItem } from "@/types/cart";
import { AddressFormData } from "@/types/address";
import { addShippingAddressClient } from "@/lib/supabase/user-profiles-client";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/utils/error-messages";
import { CheckoutContentProps } from "@/types/checkout";
import { useTranslations } from "@/components/locale-provider";

export function CheckoutContent({ cartItems, userId }: CheckoutContentProps) {
  const router = useRouter();
  const cartT = useTranslations().cart;
  const checkoutT = useTranslations().checkout;
  const c = useTranslations().common;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [formData, setFormData] = useState<{
    shipping: AddressFormData & { email?: string };
    saveAddress: boolean;
  } | null>(null);
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  if (cartItems.length === 0) {
    return (
      <Card className="p-12 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">{cartT.empty}</h2>
        <p className="text-muted-foreground mb-6">{cartT.emptyHint}</p>
        <Button asChild>
          <Link href="/products">{c.browseProducts}</Link>
        </Button>
      </Card>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => {
    // For custom letters, use the price from customizations if available
    // Otherwise use the product base price
    const itemPrice = item.customizations?.totalPrice 
      ? item.customizations.totalPrice 
      : (item.products?.price || 0);
    return sum + itemPrice * item.quantity;
  }, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  // Validate email format
  const isValidEmail = (email: string | undefined) => {
    if (!email) return false;
    const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i;
    return emailRegex.test(email);
  };

  // Validate address form
  const isAddressComplete = formData && 
    formData.shipping.firstName?.trim() !== "" &&
    formData.shipping.lastName?.trim() !== "" &&
    formData.shipping.email?.trim() !== "" &&
    isValidEmail(formData.shipping.email) &&
    formData.shipping.address?.trim() !== "" &&
    formData.shipping.city?.trim() !== "" &&
    formData.shipping.state?.trim() !== "" &&
    formData.shipping.zip?.trim() !== "" &&
    formData.shipping.country?.trim() !== "";

  // Create pending order then payment intent when address is complete (for webhook backup).
  // Depend only on total, cart length, and isAddressComplete so we don't create duplicate orders on every form keystroke.
  useEffect(() => {
    const setupPayment = async () => {
      const currentFormData = formDataRef.current;
      if (cartItems.length === 0 || !isAddressComplete || !currentFormData?.shipping) {
        setClientSecret(null);
        setPaymentIntentId(null);
        setPendingOrderId(null);
        return;
      }

      setIsLoadingPayment(true);
      try {
        const orderItems = cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.customizations?.totalPrice ?? item.products.price,
          material: item.material,
          customizations: item.customizations ?? {},
        }));

        const pendingRes = await fetch("/api/orders/create-pending", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            total_amount: total,
            shipping_address: currentFormData.shipping,
            order_items: orderItems,
          }),
        });

        if (!pendingRes.ok) {
          const err = await pendingRes.json().catch(() => ({}));
          throw new Error(err.error || "Failed to create order");
        }

        const { orderId } = await pendingRes.json();
        setPendingOrderId(orderId);

        const intentRes = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            currency: "ron",
            orderId,
          }),
        });

        if (!intentRes.ok) {
          throw new Error("Failed to create payment intent");
        }

        const data = await intentRes.json();
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } catch (error: any) {
        toast.error(error?.message || "Failed to initialize payment. Please try again.");
        setClientSecret(null);
        setPaymentIntentId(null);
        setPendingOrderId(null);
      } finally {
        setIsLoadingPayment(false);
      }
    };

    setupPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, cartItems.length, isAddressComplete]);

  const handlePaymentSuccess = async (paidPaymentIntentId: string) => {
    if (!pendingOrderId) {
      toast.error("Order session expired. Please refresh and try again.");
      return;
    }
    if (!formData) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const confirmRes = await fetch("/api/orders/confirm-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: pendingOrderId,
          paymentIntentId: paidPaymentIntentId,
        }),
      });

      if (!confirmRes.ok) {
        const err = await confirmRes.json().catch(() => ({}));
        throw new Error(err.error || "Failed to confirm order");
      }

      if (formData.saveAddress) {
        try {
          const { email, ...addressToSave } = formData.shipping;
          await addShippingAddressClient(userId, addressToSave);
        } catch (error: any) {
          toast.error("Failed to save address, but order was placed successfully");
        }
      }

      toast.success("Order placed successfully!");
      router.push(`/checkout/confirmation/${pendingOrderId}`);
    } catch (error: any) {
      const friendlyMessage = getUserFriendlyError(error);
      toast.error(friendlyMessage || "Failed to complete order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error || "Payment failed. Please try again.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      <div className="lg:col-span-2 space-y-6">
        <CheckoutForms
          onFormDataChange={(data) => {
            setFormData({
              shipping: data.shipping,
              saveAddress: data.saveAddress,
            });
          }}
        />
        {!isAddressComplete ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">{checkoutT.completeAddress}</p>
              </div>
            </CardContent>
          </Card>
        ) : isLoadingPayment ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">{checkoutT.loadingPayment}</span>
              </div>
            </CardContent>
          </Card>
        ) : clientSecret ? (
          <StripePaymentWrapper
            clientSecret={clientSecret}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            isSubmitting={isSubmitting}
          />
        ) : null}
      </div>
      <div className="lg:col-span-1">
        <OrderSummary
          cartItems={cartItems}
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
        />
      </div>
    </div>
  );
}

