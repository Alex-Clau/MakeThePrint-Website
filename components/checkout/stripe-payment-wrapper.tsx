"use client";

import { useMemo } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe/client";
import { StripePaymentForm } from "./stripe-payment-form";
import { StripePaymentWrapperProps } from "@/types/checkout";

export function StripePaymentWrapper({
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
  isSubmitting = false,
}: StripePaymentWrapperProps) {
  // Convert CSS variables to actual HSL values for Stripe
  // Light mode: accent-primary-dark = 0 0% 15%, background = 0 0% 100%, foreground = 0 0% 5%, destructive = 0 84.2% 60.2%
  // Dark mode: accent-primary = 0 0% 70%, background = 0 0% 5%, foreground = 0 0% 98%, destructive = 0 62.8% 30.6%
  const appearance = useMemo(() => {
    // Check if dark mode is active
    const isDark = document.documentElement.classList.contains("dark");

    return {
      theme: "stripe" as const,
      variables: {
        colorPrimary: isDark ? "hsl(0, 0%, 70%)" : "hsl(0, 0%, 15%)",
        colorBackground: isDark ? "hsl(0, 0%, 5%)" : "hsl(0, 0%, 100%)",
        colorText: isDark ? "hsl(0, 0%, 98%)" : "hsl(0, 0%, 5%)",
        colorDanger: isDark ? "hsl(0, 62.8%, 30.6%)" : "hsl(0, 84.2%, 60.2%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        spacingUnit: "4px",
        borderRadius: "0.5rem",
      },
    };
  }, []);

  if (!clientSecret) {
    return null;
  }

  return (
    <Elements
      key={clientSecret}
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance,
      }}
    >
      <StripePaymentForm
        clientSecret={clientSecret}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        isSubmitting={isSubmitting}
      />
    </Elements>
  );
}

