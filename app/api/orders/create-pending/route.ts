import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPendingOrder } from "@/lib/supabase/orders";
import type { CreatePendingOrderInput } from "@/lib/supabase/orders";
import { apiErrorResponse, normalizeToApiError } from "@/lib/utils/api-error";
import { getShippingCost } from "@/lib/constants/shipping";
import { isPresetLettersConfig } from "@/lib/utils/products";
import { computePresetCustomizationPrice } from "@/lib/utils/preset-customization-pricing";

const PRICE_EPSILON = 0.01;

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

    const productIds = [...new Set(order_items.map((item) => item.product_id))];
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, category, price, custom_config")
      .in("id", productIds);

    if (productsError) {
      return apiErrorResponse(productsError.message, 500);
    }

    const productMap = new Map(
      (products ?? []).map((product) => [product.id, product])
    );

    let expectedSubtotal = 0;
    let validatedOrderItems: CreatePendingOrderInput["order_items"];
    try {
      validatedOrderItems = order_items.map((item) => {
        const product = productMap.get(item.product_id);
        if (!product) {
          throw new Error(`Product not found: ${item.product_id}`);
        }
        if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
          throw new Error(`Invalid quantity for product: ${item.product_id}`);
        }

        let expectedPrice = Number(product.price);
        if (product.category === "preset" && isPresetLettersConfig(product.custom_config)) {
          const customizations = (item.customizations ?? {}) as {
            text?: unknown;
            size?: unknown;
            isOutdoor?: unknown;
            isLedStrip?: unknown;
            isColor?: unknown;
          };

          const text = typeof customizations.text === "string" ? customizations.text : "";
          const size = typeof customizations.size === "string" ? customizations.size : "";
          const pricing = computePresetCustomizationPrice(product.custom_config, {
            text,
            size,
            isOutdoor: customizations.isOutdoor === true,
            isLedStrip: customizations.isLedStrip === true,
            isColor: customizations.isColor === true,
          });
          expectedPrice = pricing.totalPrice;
        }

        if (Math.abs(expectedPrice - Number(item.price)) > PRICE_EPSILON) {
          throw new Error(`Price mismatch for product: ${item.product_id}`);
        }

        expectedSubtotal += expectedPrice * item.quantity;

        return {
          ...item,
          price: expectedPrice,
        };
      });
    } catch (validationError) {
      return NextResponse.json(
        { error: normalizeToApiError(validationError).message },
        { status: 400 }
      );
    }

    const expectedTotal = expectedSubtotal + getShippingCost(expectedSubtotal);
    if (Math.abs(expectedTotal - Number(total_amount)) > PRICE_EPSILON) {
      return NextResponse.json(
        {
          error: "Invalid request: total amount mismatch",
        },
        { status: 400 }
      );
    }

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
