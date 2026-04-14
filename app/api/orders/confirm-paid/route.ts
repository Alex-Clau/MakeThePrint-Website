import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { setOrderPaid, getOrderForPayment } from "@/lib/supabase/orders";
import { clearCart } from "@/lib/supabase/cart";
import { sendOrderConfirmationEmails } from "@/lib/email/send-order-confirmation";
import { apiErrorResponse, normalizeToApiError } from "@/lib/utils/api-error";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return apiErrorResponse("Unauthorized", 401, "UNAUTHORIZED");
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

    const order = await getOrderForPayment(orderId, user.id);
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
      return NextResponse.json({ orderId, alreadyPaid: true });
    }

    await setOrderPaid(orderId, user.id, paymentIntentId);
    await clearCart(user.id);
    await sendOrderConfirmationEmails(orderId);

    return NextResponse.json({ orderId });
  } catch (err) {
    const { message } = normalizeToApiError(err);
    const isNotFound = message === "Order not found";
    return apiErrorResponse(
      message,
      isNotFound ? 404 : 500,
      isNotFound ? "NOT_FOUND" : undefined
    );
  }
}
