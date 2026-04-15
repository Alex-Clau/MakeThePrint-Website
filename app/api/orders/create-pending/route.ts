import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPendingOrder } from "@/lib/supabase/orders";
import type { CreatePendingOrderInput } from "@/lib/supabase/orders";
import { apiErrorResponse, normalizeToApiError } from "@/lib/utils/api-error";
import { getShippingCost } from "@/lib/constants/shipping";
import { getCartItems } from "@/lib/supabase/cart";
import { getCartSubtotal, getCartUnitPrice } from "@/lib/cart/pricing";

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
    const { shipping_address } = body as { shipping_address?: Record<string, unknown> };

    if (!shipping_address) {
      return NextResponse.json(
        {
          error: "Invalid request: shipping_address is required",
        },
        { status: 400 }
      );
    }

    const cartItems = await getCartItems(user.id);
    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const expectedSubtotal = getCartSubtotal(cartItems);
    const expectedTotal = expectedSubtotal + getShippingCost(expectedSubtotal);
    const validatedOrderItems: CreatePendingOrderInput["order_items"] = cartItems.map(
      (item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: getCartUnitPrice(item),
        material: item.material,
        customizations: item.customizations ?? {},
      })
    );

    const { orderId } = await createPendingOrder(user.id, {
      total_amount: expectedTotal,
      shipping_address,
      order_items: validatedOrderItems,
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
