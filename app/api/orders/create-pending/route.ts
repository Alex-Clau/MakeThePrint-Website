import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    const {
      total_amount,
      shipping_address,
      order_items,
    }: {
      total_amount: number;
      shipping_address: Record<string, unknown>;
      order_items: Array<{
        product_id: string;
        quantity: number;
        price: number;
        material?: string;
        customizations?: Record<string, unknown>;
      }>;
    } = body;

    if (
      total_amount == null ||
      total_amount <= 0 ||
      !shipping_address ||
      !Array.isArray(order_items) ||
      order_items.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid request: total_amount, shipping_address, and order_items required" },
        { status: 400 }
      );
    }

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: Number(total_amount),
        shipping_address,
        billing_address: shipping_address,
        payment_status: "pending",
        payment_method: "stripe",
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError) {
      return NextResponse.json(
        { error: orderError.message || "Failed to create order" },
        { status: 500 }
      );
    }

    if (!orderData) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    const rows = order_items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: Number(item.price),
      material: item.material ?? null,
      customizations: item.customizations ?? {},
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(rows);

    if (itemsError) {
      await supabase.from("orders").delete().eq("id", orderData.id);
      return NextResponse.json(
        { error: itemsError.message || "Failed to create order items" },
        { status: 500 }
      );
    }

    return NextResponse.json({ orderId: orderData.id });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
