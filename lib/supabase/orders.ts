import { createClient } from "./server";
import { handleSupabaseError } from "../utils/supabase-errors";

/**
 * Get user's orders
 */
export async function getOrders(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw handleSupabaseError(error);
  }
  return data;
}

/**
 * Get a single order by ID
 */
export async function getOrderById(orderId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *,
        products (
          id,
          name,
          price,
          images
        )
      )
    `
    )
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (error) {
    throw handleSupabaseError(error);
  }
  return data;
}

/**
 * Create a new order from cart items
 */
export async function createOrder(order: {
  user_id: string;
  total_amount: number;
  shipping_address: Record<string, any>;
  billing_address?: Record<string, any>;
  payment_status?: string;
  payment_method?: string;
  notes?: string;
  order_items: Array<{
    product_id: string;
    quantity: number;
    price: number;
    material?: string;
    customizations?: Record<string, any>;
  }>;
}) {
  const supabase = await createClient();

  // Create order
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: order.user_id,
      total_amount: order.total_amount,
      shipping_address: order.shipping_address,
      billing_address: order.billing_address,
      payment_status: order.payment_status || "pending",
      payment_method: order.payment_method,
      notes: order.notes,
      status: "pending",
    })
    .select()
    .single();

  if (orderError) throw orderError;

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

  if (itemsError) throw itemsError;

  // Clear cart after order creation
  await supabase.from("cart").delete().eq("user_id", order.user_id);

  return orderData;
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .update({
      status,
      tracking_number: trackingNumber,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    throw handleSupabaseError(error);
  }
  return data;
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .update({
      payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    throw handleSupabaseError(error);
  }
  return data;
}

