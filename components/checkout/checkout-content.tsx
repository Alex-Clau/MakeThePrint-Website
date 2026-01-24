"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { CheckoutForms } from "./checkout-forms";
import { OrderSummary } from "./order-summary";
import { StripePaymentWrapper } from "./stripe-payment-wrapper";
import { createOrderClient } from "@/lib/supabase/orders-client";
import { createClient } from "@/lib/supabase/client";
import { CartItem } from "@/types/cart";
import { AddressFormData } from "@/types/address";
import { addShippingAddressClient } from "@/lib/supabase/user-profiles-client";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/utils/error-messages";
import { CheckoutContentProps } from "@/types/checkout";

export function CheckoutContent({ cartItems, userId }: CheckoutContentProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [formData, setFormData] = useState<{
    shipping: AddressFormData & { email?: string };
    saveAddress: boolean;
  } | null>(null);

  if (cartItems.length === 0) {
    return (
      <Card className="p-12 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add items to your cart before checkout
        </p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
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

  // Create payment intent only after address is complete
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (cartItems.length === 0 || !isAddressComplete) {
        setClientSecret(null);
        setPaymentIntentId(null);
        return;
      }

      setIsLoadingPayment(true);
      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: total,
            currency: "usd",
            metadata: {
              userId,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } catch (error: any) {
        toast.error("Failed to initialize payment. Please try again.");
        console.error("Error creating payment intent:", error);
      } finally {
        setIsLoadingPayment(false);
      }
    };

    createPaymentIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, cartItems.length, userId, isAddressComplete]);

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!formData) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate required fields
    const requiredFields = [
      formData.shipping.firstName,
      formData.shipping.lastName,
      formData.shipping.email,
      formData.shipping.address,
      formData.shipping.city,
      formData.shipping.state,
      formData.shipping.zip,
      formData.shipping.country,
    ];

    if (requiredFields.some((field) => !field || field.trim() === "")) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Confirm payment status
      const confirmResponse = await fetch("/api/stripe/confirm-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId,
        }),
      });

      if (!confirmResponse.ok) {
        throw new Error("Failed to confirm payment");
      }

      const paymentData = await confirmResponse.json();

      if (paymentData.status !== "succeeded") {
        throw new Error("Payment was not successful");
      }

      const orderItems = cartItems.map((item) => {
        // For custom letters, use the price from customizations if available
        // Otherwise use the product base price
        const itemPrice = item.customizations?.totalPrice 
          ? item.customizations.totalPrice 
          : item.products.price;
        
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          price: itemPrice,
          material: item.material,
          customizations: item.customizations || {},
        };
      });

      const shippingAddress = {
        ...formData.shipping,
      };

      const orderId = await createOrderClient({
        user_id: userId,
        total_amount: total,
        shipping_address: shippingAddress,
        payment_method: "stripe",
        payment_status: "paid",
        payment_intent_id: paymentIntentId,
        order_items: orderItems,
      });

      // Save address if checkbox was checked
      if (formData.saveAddress) {
        try {
          const { email, ...addressToSave } = shippingAddress;
          await addShippingAddressClient(userId, addressToSave);
        } catch (error: any) {
          toast.error("Failed to save address, but order was placed successfully");
          // Don't fail the order if address save fails
        }
      }

      toast.success("Order placed successfully!");
      router.push(`/checkout/confirmation/${orderId}`);
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
                <p className="text-sm">
                  Please complete the shipping address form above to proceed with payment.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : isLoadingPayment ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                  Loading payment form...
                </span>
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

