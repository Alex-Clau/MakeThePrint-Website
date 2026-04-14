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
      return NextResponse.json(
        { error: "orderId is required for payment" },
        { status: 400 }
      );
    }

    let order: { id: string; total_amount: number; payment_status: string };
    try {
      order = await getOrderForPayment(orderId, user.id);
    } catch {
      return apiErrorResponse("Order not found", 404, "NOT_FOUND");
    }

    if (order.payment_status === "paid") {
      return NextResponse.json(
        { error: "Order already paid" },
        { status: 400 }
      );
    }

    const amount = Number(order.total_amount);
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount" },
        { status: 400 }
      );
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
