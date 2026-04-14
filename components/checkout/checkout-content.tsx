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
import { AddressFormData } from "@/types/address";
import { addShippingAddressClient } from "@/lib/supabase/user-profiles-client";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/utils/error-messages";
import { getApiErrorBody } from "@/lib/utils/api-error";
import { CheckoutContentProps } from "@/types/checkout";
import { getShippingCost } from "@/lib/constants/shipping";
import { messages } from "@/lib/messages";
import { getCartSubtotal } from "@/lib/cart/pricing";

export function CheckoutContent({
  cartItems,
  userId,
  savedAddresses = [],
  userEmail,
}: CheckoutContentProps) {
  const router = useRouter();
  const cartT = messages.cart;
  const checkoutT = messages.checkout;
  const c = messages.common;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [, setPaymentIntentId] = useState<string | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [formData, setFormData] = useState<{
    shipping: AddressFormData & { email?: string };
    saveAddress: boolean;
  } | null>(null);
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  const subtotal = getCartSubtotal(cartItems);

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

  const shippingCost = getShippingCost(subtotal);
  const shipping = isAddressComplete ? shippingCost : 0;
  const total = isAddressComplete ? subtotal + shippingCost : subtotal;

  const clearPaymentState = () => {
    setClientSecret(null);
    setPaymentIntentId(null);
    setPendingOrderId(null);
  };

  const handleFetchError = async (
    res: Response,
    fallbackMessage: string
  ): Promise<boolean> => {
    const { message, code } = await getApiErrorBody(res);
    toast.error(message || fallbackMessage);
    clearPaymentState();
    if (code === "UNAUTHORIZED") router.push("/auth/login?redirect=/checkout");
    return true;
  };

  // Create pending order then payment intent when address is complete (for webhook backup).
  // Depend only on total, cart length, and isAddressComplete so we don't create duplicate orders on every form keystroke.
  useEffect(() => {
    const setupPayment = async () => {
      const currentFormData = formDataRef.current;
      if (cartItems.length === 0 || !isAddressComplete || !currentFormData?.shipping) {
        clearPaymentState();
        return;
      }

      setIsLoadingPayment(true);
      try {
        const pendingRes = await fetch("/api/orders/create-pending", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shipping_address: currentFormData.shipping,
          }),
        });

        if (!pendingRes.ok) {
          await handleFetchError(pendingRes, checkoutT.failedCreateOrder);
          return;
        }

        const { orderId } = await pendingRes.json();
        setPendingOrderId(orderId);

        const intentRes = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currency: "ron",
            orderId,
          }),
        });

        if (!intentRes.ok) {
          await handleFetchError(intentRes, checkoutT.failedCreatePaymentIntent);
          return;
        }

        const data = await intentRes.json();
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } catch (error: unknown) {
        toast.error(getUserFriendlyError(error) || checkoutT.failedInitializePayment);
        clearPaymentState();
      } finally {
        setIsLoadingPayment(false);
      }
    };

    setupPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, cartItems.length, isAddressComplete]);

  const handlePaymentSuccess = async (paidPaymentIntentId: string) => {
    if (!pendingOrderId) {
      toast.error(checkoutT.orderSessionExpired);
      return;
    }
    if (!formData) {
      toast.error(checkoutT.fillRequiredFields);
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
        const { message, code } = await getApiErrorBody(confirmRes);
        toast.error(message || checkoutT.failedConfirmOrder);
        if (code === "UNAUTHORIZED") router.push("/auth/login?redirect=/checkout");
        setIsSubmitting(false);
        return;
      }

      if (formData.saveAddress) {
        try {
          const { ...addressToSave } = formData.shipping;
          await addShippingAddressClient(userId, addressToSave);
        } catch (error: unknown) {
          toast.error(getUserFriendlyError(error) || checkoutT.failedSaveAddressOrderPlaced);
        }
      }

      toast.success(checkoutT.orderPlacedSuccess);
      router.push(`/checkout/confirmation/${pendingOrderId}`);
    } catch (error: unknown) {
      toast.error(getUserFriendlyError(error) || checkoutT.failedConfirmOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error || checkoutT.paymentFailedTryAgain);
  };

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
          savedAddresses={savedAddresses}
          userEmail={userEmail}
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
          total={total}
          showShipping={!!isAddressComplete}
        />
      </div>
    </div>
  );
}

