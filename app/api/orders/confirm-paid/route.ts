import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { finalizePaidOrderFromPaymentIntent } from "@/lib/orders/finalize-paid-from-intent";
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
      return apiErrorResponse("orderId and paymentIntentId required", 400, "BAD_REQUEST");
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return apiErrorResponse("Payment has not succeeded", 400, "BAD_REQUEST");
    }

    const outcome = await finalizePaidOrderFromPaymentIntent(paymentIntent, {
      sessionUserId: user.id,
      sessionOrderId: orderId,
    });

    if (outcome.kind === "reject") {
      const code =
        outcome.httpStatus === 403
          ? "FORBIDDEN"
          : outcome.httpStatus === 409
            ? "CONFLICT"
            : outcome.httpStatus === 404
              ? "NOT_FOUND"
              : outcome.httpStatus === 400
                ? "BAD_REQUEST"
                : undefined;
      return apiErrorResponse(outcome.error, outcome.httpStatus, code);
    }

    return NextResponse.json({ orderId, alreadyPaid: outcome.alreadyPaid });
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
