import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
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
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment intent ID is required" },
        { status: 400 }
      );
    }

    // Retrieve payment intent to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Verify the payment intent belongs to the user
    if (paymentIntent.metadata.userId !== user.id) {
      return NextResponse.json(
        { error: "Payment intent does not belong to user" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      status: paymentIntent.status,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100, // Convert from cents
    });
  } catch (error: unknown) {
    const { message } = normalizeToApiError(error);
    return apiErrorResponse(message, 500);
  }
}

