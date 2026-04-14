import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import {
  getOrderPaymentStateAdmin,
  setOrderPaidAdmin,
} from "@/lib/supabase/orders-admin";
import { clearCartAdmin } from "@/lib/supabase/cart";
import { sendOrderConfirmationEmails } from "@/lib/email/send-order-confirmation";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook configuration error" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  if (event.type !== "payment_intent.succeeded") {
    return NextResponse.json({ received: true });
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const orderId = paymentIntent.metadata?.orderId;
  const userId = paymentIntent.metadata?.userId;

  if (!orderId || !userId) {
    return NextResponse.json(
      { error: "Missing metadata" },
      { status: 400 }
    );
  }

  try {
    const order = await getOrderPaymentStateAdmin(orderId, userId);
    const expectedAmount = Math.round(Number(order.total_amount) * 100);

    if (paymentIntent.currency !== "ron") {
      return NextResponse.json(
        { error: "Payment currency mismatch" },
        { status: 400 }
      );
    }

    if (paymentIntent.amount !== expectedAmount) {
      return NextResponse.json(
        { error: "Payment amount mismatch" },
        { status: 400 }
      );
    }

    if (order.payment_status === "paid") {
      // Stripe retries webhooks; make this handler idempotent.
      if (order.payment_intent_id !== paymentIntent.id) {
        return NextResponse.json(
          { error: "Order already paid by different payment intent" },
          { status: 409 }
        );
      }
      return NextResponse.json({ received: true, alreadyPaid: true });
    }

    await setOrderPaidAdmin(orderId, userId, paymentIntent.id);
    const { error: cartError } = await clearCartAdmin(userId);
    if (cartError) throw cartError;
    const emailResult = await sendOrderConfirmationEmails(orderId);
    if (!emailResult.ok) {
      console.error("[stripe/webhook] confirmation email failed", {
        orderId,
        error: emailResult.error,
      });
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
