"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "@/lib/supabase/products";
import { isAdminOrderStatus } from "@/lib/constants/admin-order-status";
import type { CustomProductConfig, KeychainConfig } from "@/types/product";

const ORDER_ID_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Check if current user is admin
 */
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/?error=unauthorized");
  }

  return user;
}

/**
 * Server action to create a product
 */
export async function createProductAction(product: {
  name: string;
  description?: string;
  price: number;
  images?: string[];
  featured?: boolean;
  product_type?: "custom" | "seasonal";
  category?: string;
  custom_config?: CustomProductConfig | KeychainConfig;
}) {
  await requireAdmin();
  const data = await createProduct({
    ...product,
    images: product.images || [],
  });
  revalidatePath("/admin/products");
  return data ?? null;
}

/**
 * Server action to update a product
 */
export async function updateProductAction(
  id: string,
  updates: Partial<{
    name: string;
    description: string;
    price: number;
    images: string[];
    featured: boolean;
    product_type?: "custom" | "seasonal";
    category?: string;
    custom_config?: CustomProductConfig | KeychainConfig;
  }>
) {
  await requireAdmin();
  await getProductById(id);
  const data = await updateProduct(id, updates);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath(`/products/${id}`);
  return data ?? null;
}

/**
 * Server action to delete a product
 */
export async function deleteProductAction(productId: string) {
  await requireAdmin();
  await deleteProduct(productId);
  revalidatePath("/admin/products");
  return { success: true };
}

/**
 * Admin-only: update order status and optional tracking
 */
export async function updateOrderStatusAction(
  orderId: string,
  status: string,
  trackingNumber?: string | null
) {
  await requireAdmin();
  const trimmedId = orderId?.trim() ?? "";
  if (!trimmedId || !ORDER_ID_UUID.test(trimmedId)) {
    throw new Error("Invalid order id");
  }
  if (!isAdminOrderStatus(status)) {
    throw new Error("Invalid order status");
  }
  const { updateOrderStatusAdmin } = await import("@/lib/supabase/orders-admin");
  await updateOrderStatusAdmin(trimmedId, status, trackingNumber);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${trimmedId}`);
}

/**
 * Form action for admin order status update
 */
export async function updateOrderStatusFormAction(formData: FormData) {
  const orderId = formData.get("orderId");
  const status = formData.get("status");
  const raw = formData.get("trackingNumber");
  const trackingNumber =
    raw === null || raw === undefined || raw === "" ? null : String(raw).trim() || null;
  if (typeof orderId !== "string" || typeof status !== "string") {
    throw new Error("Missing order id or status");
  }
  await updateOrderStatusAction(orderId, status, trackingNumber);
}
