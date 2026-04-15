import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { getOrderForPayment } from "@/lib/supabase/orders";
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
    const { orderId } = body;

    if (!orderId || typeof orderId !== "string") {
      return apiErrorResponse("orderId is required for payment", 400, "BAD_REQUEST");
    }

    let order: { id: string; total_amount: number; payment_status: string };
    try {
      order = await getOrderForPayment(orderId, user.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "Order not found") {
        return apiErrorResponse("Order not found", 404, "NOT_FOUND");
      }
      const { message } = normalizeToApiError(err);
      return apiErrorResponse(message, 500);
    }

    if (order.payment_status === "paid") {
      return apiErrorResponse("Order already paid", 400, "ORDER_ALREADY_PAID");
    }

    const amount = Number(order.total_amount);
    if (!amount || amount <= 0) {
      return apiErrorResponse("Invalid order amount", 400, "BAD_REQUEST");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "ron",
      metadata: {
        userId: user.id,
        orderId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: unknown) {
    const { message } = normalizeToApiError(error);
    return apiErrorResponse(message, 500);
  }
}
