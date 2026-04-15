import { createClient } from "./server";
import { handleSupabaseError } from "../utils/supabase-errors";
import type { Order } from "@/types/order";

/**
 * Get user's orders
 */
export async function getOrders(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, user_id, total_amount, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw handleSupabaseError(error);
  }
  return data;
}

export async function getOrdersPage(params: {
  userId: string;
  page: number;
  pageSize: number;
}): Promise<{ orders: Awaited<ReturnType<typeof getOrders>>; hasMore: boolean }> {
  const supabase = await createClient();
  const from = (params.page - 1) * params.pageSize;
  const to = from + params.pageSize - 1;
  const { data, error, count } = await supabase
    .from("orders")
    .select("id, user_id, total_amount, status, created_at", { count: "exact" })
    .eq("user_id", params.userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw handleSupabaseError(error);
  }

  const total = count ?? data?.length ?? 0;
  const hasMore = total ? to + 1 < total : (data?.length ?? 0) === params.pageSize;
  return { orders: data ?? [], hasMore };
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
      id,
      total_amount,
      shipping_address,
      tracking_number,
      created_at,
      status,
      payment_status,
      confirmation_email_sent_at,
      order_items (
        id,
        quantity,
        price,
        material,
        customizations,
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

  const normalizedItems = (data.order_items ?? []).map((item) => ({
    ...item,
    // Supabase nested relation typing can return an array shape even for single product relation.
    products: Array.isArray(item.products) ? (item.products[0] ?? null) : item.products,
  }));

  return {
    ...data,
    order_items: normalizedItems,
  } as unknown as Order;
}

/** Input for creating a pending order (checkout flow). */
export interface CreatePendingOrderInput {
  total_amount: number;
  shipping_address: Record<string, unknown>;
  order_items: Array<{
    product_id: string;
    quantity: number;
    price: number;
    material?: string | null;
    customizations?: Record<string, unknown>;
  }>;
}

/**
 * Create a pending order and its items (for Stripe checkout).
 * Does not clear cart. On order_items insert failure, deletes the order and throws.
 */
export async function createPendingOrder(
  userId: string,
  input: CreatePendingOrderInput
): Promise<{ orderId: string }> {
  const supabase = await createClient();
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total_amount: Number(input.total_amount),
      shipping_address: input.shipping_address,
      billing_address: input.shipping_address,
      payment_status: "pending",
      payment_method: "stripe",
      status: "pending",
    })
    .select("id")
    .single();

  if (orderError || !orderData) {
    throw new Error(orderError?.message ?? "Failed to create order");
  }

  const rows = input.order_items.map((item) => ({
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
    throw new Error(itemsError.message ?? "Failed to create order items");
  }

  return { orderId: orderData.id };
}

/**
 * Get order for payment intent (id, total_amount, payment_status). Throws if not found or wrong user.
 */
export async function getOrderForPayment(orderId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, total_amount, payment_status, payment_intent_id")
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    throw new Error("Order not found");
  }
  return data;
}

