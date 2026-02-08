import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmationEmails } from "@/lib/email/send-order-confirmation";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, paymentIntentId } = body;

    if (!orderId || !paymentIntentId) {
      return NextResponse.json(
        { error: "orderId and paymentIntentId required" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment has not succeeded" },
        { status: 400 }
      );
    }

    if (paymentIntent.metadata.userId !== user.id) {
      return NextResponse.json(
        { error: "Payment intent does not belong to user" },
        { status: 403 }
      );
    }

    if (paymentIntent.metadata.orderId !== orderId) {
      return NextResponse.json(
        { error: "Payment intent does not match order" },
        { status: 403 }
      );
    }

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, payment_status")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({ orderId, alreadyPaid: true });
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "confirmed",
        payment_intent_id: paymentIntentId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    await supabase.from("cart").delete().eq("user_id", user.id);

    await sendOrderConfirmationEmails(orderId);

    return NextResponse.json({ orderId });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
