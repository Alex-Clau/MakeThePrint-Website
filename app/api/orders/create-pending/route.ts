import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPendingOrder } from "@/lib/supabase/orders";
import type { CreatePendingOrderInput } from "@/lib/supabase/orders";
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
    const {
      total_amount,
      shipping_address,
      order_items,
    }: CreatePendingOrderInput = body;

    if (
      total_amount == null ||
      total_amount <= 0 ||
      !shipping_address ||
      !Array.isArray(order_items) ||
      order_items.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid request: total_amount, shipping_address, and order_items required",
        },
        { status: 400 }
      );
    }

    const { orderId } = await createPendingOrder(user.id, {
      total_amount,
      shipping_address,
      order_items,
    });

    return NextResponse.json({ orderId });
  } catch (err) {
    const { message } = normalizeToApiError(err);
    return apiErrorResponse(
      message,
      message === "Unauthorized" ? 401 : 500
    );
  }
}
