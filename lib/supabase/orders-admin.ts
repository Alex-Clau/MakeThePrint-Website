import type { AdminOrderStatus } from "@/lib/constants/admin-order-status";
import { createAdminClient } from "./admin";

type AdminOrderListItem = {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  total_amount: number;
  tracking_number: string | null;
  shipping_address: Record<string, unknown> | null;
};

export async function getAdminOrdersPage(params: {
  page: number;
  pageSize: number;
}): Promise<{ orders: AdminOrderListItem[]; hasMore: boolean }> {
  const supabase = createAdminClient();
  const from = (params.page - 1) * params.pageSize;
  const to = from + params.pageSize - 1;
  const { data, error, count } = await supabase
    .from("orders")
    .select(
      `
      id,
      created_at,
      status,
      payment_status,
      total_amount,
      tracking_number,
      shipping_address
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const total = count ?? data?.length ?? 0;
  const hasMore = total ? to + 1 < total : (data?.length ?? 0) === params.pageSize;
  return { orders: (data ?? []) as AdminOrderListItem[], hasMore };
}

/**
 * Admin-only: get one order by id (any user).
 */
export async function getOrderByIdAdmin(orderId: string) {
  const supabase = createAdminClient();
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
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin-only: update order status and optional tracking.
 */
export async function updateOrderStatusAdmin(
  orderId: string,
  status: AdminOrderStatus,
  trackingNumber?: string | null
) {
  const supabase = createAdminClient();
  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (trackingNumber !== undefined) {
    updates.tracking_number = trackingNumber || null;
  }
  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Mark order as paid (webhook / admin). Uses service role client.
 */
export async function setOrderPaidAdmin(
  orderId: string,
  userId: string,
  paymentIntentId: string
) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      status: "confirmed",
      payment_intent_id: paymentIntentId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .eq("user_id", userId);

  if (error) throw error;
}

/**
 * Admin-only: get payment state for one order/user pair.
 */
export async function getOrderPaymentStateAdmin(orderId: string, userId: string) {
  const supabase = createAdminClient();
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
