import { createAdminClient } from "./admin";

/**
 * Admin-only: get all orders (for admin dashboard).
 */
export async function getAllOrdersAdmin() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
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
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
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
  status: string,
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
