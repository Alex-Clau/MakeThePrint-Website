import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

  const supabase = createAdminClient();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, payment_status")
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  if (order.payment_status === "paid") {
    return NextResponse.json({ received: true });
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      status: "confirmed",
      payment_intent_id: paymentIntent.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .eq("user_id", userId);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }

  await supabase.from("cart").delete().eq("user_id", userId);

  await sendOrderConfirmationEmails(orderId);

  return NextResponse.json({ received: true });
}
