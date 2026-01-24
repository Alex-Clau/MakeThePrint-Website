"use client";

import { createClient } from "./client";
import { getUserFriendlyError } from "../utils/error-messages";

/**
 * Create a new order from cart items - Client-side
 */
export async function createOrderClient(order: {
  user_id: string;
  total_amount: number;
  shipping_address: Record<string, any>;
  billing_address?: Record<string, any>;
  payment_status?: string;
  payment_method?: string;
  payment_intent_id?: string;
  notes?: string;
  order_items: Array<{
    product_id: string;
    quantity: number;
    price: number;
    material?: string;
    customizations?: Record<string, any>;
  }>;
}) {
  const supabase = createClient();

  // Create order
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: order.user_id,
      total_amount: order.total_amount,
      shipping_address: order.shipping_address,
      billing_address: order.billing_address || order.shipping_address,
      payment_status: order.payment_status || "pending",
      payment_method: order.payment_method,
      payment_intent_id: order.payment_intent_id,
      notes: order.notes,
      status: "pending",
    })
    .select()
    .single();

  if (orderError) {
    const friendlyMessage = getUserFriendlyError(orderError);
    throw new Error(friendlyMessage);
  }

  if (!orderData) {
    throw new Error("Something went wrong while creating your order. Please try again.");
  }

  // Create order items
  const orderItems = order.order_items.map((item) => ({
    order_id: orderData.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
    material: item.material,
    customizations: item.customizations || {},
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    const friendlyMessage = getUserFriendlyError(itemsError);
    throw new Error(friendlyMessage);
  }

  // Clear cart after order creation
  await supabase.from("cart").delete().eq("user_id", order.user_id);

  return orderData.id;
}

