"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { StripePaymentFormProps } from "@/types/checkout";
import { messages } from "@/lib/messages";

export function StripePaymentForm({
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
  isSubmitting = false,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }
    const t = messages.checkout;
    stripe.retrievePaymentIntent(clientSecret).then((result) => {
      if (result.paymentIntent) {
        switch (result.paymentIntent.status) {
          case "succeeded":
            setMessage(t.paymentSucceeded);
            break;
          case "processing":
            setMessage(t.paymentProcessing);
            break;
          case "requires_payment_method":
            // Initial state before user enters card – don't show error
            setMessage(null);
            break;
          default:
            setMessage(t.somethingWentWrong);
            break;
        }
      }
    });
  }, [stripe, clientSecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/confirmation`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || messages.checkout.somethingWentWrong);
      onPaymentError(error.message || messages.checkout.paymentNotSuccessful);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage(messages.checkout.paymentSucceeded);
      onPaymentSuccess(paymentIntent.id);
      setIsProcessing(false);
    } else {
      setIsProcessing(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {messages.checkout.paymentMethod}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement
            id="payment-element"
            options={{
              layout: "tabs",
            }}
          />
          {message && (
            <div
              className={`text-sm ${
                message === messages.checkout.paymentSucceeded || message === messages.checkout.paymentProcessing
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {message}
            </div>
          )}
          <Button
            type="submit"
            disabled={isProcessing || isSubmitting || !stripe || !elements}
            className="w-full"
            size="lg"
          >
            {isProcessing || isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {messages.checkout.processing}
              </>
            ) : (
              messages.checkout.payNow
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

