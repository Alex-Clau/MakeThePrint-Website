import Stripe from "stripe";
import {
  getOrderPaymentStateAdmin,
  setOrderPaidAdmin,
} from "@/lib/supabase/orders-admin";
import { clearCartAdmin } from "@/lib/supabase/cart";
import { sendOrderConfirmationEmails } from "@/lib/email/send-order-confirmation";

export type FinalizePaidOrderOptions = {
  /** From an authenticated session; must match PaymentIntent metadata (confirm-paid). */
  sessionUserId?: string;
  sessionOrderId?: string;
};

export type FinalizePaidOrderOutcome =
  | { kind: "completed"; alreadyPaid: boolean }
  | { kind: "reject"; httpStatus: number; error: string };

/**
 * Single path for marking an order paid after Stripe reports a succeeded PaymentIntent.
 * Used by POST /api/orders/confirm-paid and POST /api/stripe/webhook.
 */
export async function finalizePaidOrderFromPaymentIntent(
  paymentIntent: Stripe.PaymentIntent,
  options?: FinalizePaidOrderOptions
): Promise<FinalizePaidOrderOutcome> {
  const orderId = paymentIntent.metadata?.orderId;
  const userId = paymentIntent.metadata?.userId;

  if (!orderId || !userId) {
    return { kind: "reject", httpStatus: 400, error: "Missing metadata" };
  }

  if (options?.sessionUserId !== undefined || options?.sessionOrderId !== undefined) {
    if (options.sessionUserId !== userId) {
      return { kind: "reject", httpStatus: 403, error: "Payment intent does not belong to user" };
    }
    if (options.sessionOrderId !== orderId) {
      return { kind: "reject", httpStatus: 403, error: "Payment intent does not match order" };
    }
  }

  try {
    const order = await getOrderPaymentStateAdmin(orderId, userId);
    const expectedAmount = Math.round(Number(order.total_amount) * 100);

    if (paymentIntent.currency !== "ron") {
      return { kind: "reject", httpStatus: 400, error: "Payment currency mismatch" };
    }

    if (paymentIntent.amount !== expectedAmount) {
      return { kind: "reject", httpStatus: 400, error: "Payment amount mismatch" };
    }

    if (order.payment_status === "paid") {
      if (order.payment_intent_id !== paymentIntent.id) {
        return {
          kind: "reject",
          httpStatus: 409,
          error: "Order already paid by different payment intent",
        };
      }
      return { kind: "completed", alreadyPaid: true };
    }

    await setOrderPaidAdmin(orderId, userId, paymentIntent.id);
    const { error: cartError } = await clearCartAdmin(userId);
    if (cartError) {
      throw cartError;
    }

    const emailResult = await sendOrderConfirmationEmails(orderId);
    if (!emailResult.ok) {
      console.error("[finalizePaidOrderFromPaymentIntent] confirmation email failed", {
        orderId,
        error: emailResult.error,
      });
    }

    return { kind: "completed", alreadyPaid: false };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Finalize failed";
    const isNotFound = message === "Order not found";
    return {
      kind: "reject",
      httpStatus: isNotFound ? 404 : 500,
      error: isNotFound ? "Order not found" : message,
    };
  }
}
