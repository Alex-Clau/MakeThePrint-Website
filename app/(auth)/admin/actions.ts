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
import { messages } from "@/lib/messages";
import type { CustomProductConfig, InquireContactConfig } from "@/types/product";

const ORDER_ID_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Same shape as order status form — for admin product mutations and toasts. */
export type AdminToastResult =
  | { success: true; message: string }
  | { success: false; message: string };

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
  custom_config?: CustomProductConfig | InquireContactConfig;
}): Promise<AdminToastResult> {
  try {
    await requireAdmin();
    const created = await createProduct({
      ...product,
      images: product.images || [],
    });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    if (created?.id) {
      revalidatePath(`/products/${created.id}`);
    }
    return { success: true, message: messages.admin.productCreated };
  } catch {
    return { success: false, message: messages.admin.adminActionFailed };
  }
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
    custom_config?: CustomProductConfig | InquireContactConfig;
  }>
): Promise<AdminToastResult> {
  try {
    await requireAdmin();
    await getProductById(id);
    await updateProduct(id, updates);
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath(`/products/${id}`);
    return { success: true, message: messages.admin.productUpdated };
  } catch {
    return { success: false, message: messages.admin.adminActionFailed };
  }
}

/**
 * Server action to delete a product
 */
export async function deleteProductAction(productId: string): Promise<AdminToastResult> {
  try {
    await requireAdmin();
    await deleteProduct(productId);
    revalidatePath("/admin/products");
    return { success: true, message: messages.admin.productDeleted };
  } catch {
    return { success: false, message: messages.admin.adminActionFailed };
  }
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

export type UpdateOrderStatusFormResult =
  | { success: true; message: string }
  | { success: false; message: string };

/**
 * Form handler for admin order status update — returns a message for client toasts.
 */
export async function updateOrderStatusFormAction(
  formData: FormData
): Promise<UpdateOrderStatusFormResult> {
  try {
    const orderId = formData.get("orderId");
    const status = formData.get("status");
    const raw = formData.get("trackingNumber");
    const trackingNumber =
      raw === null || raw === undefined || raw === "" ? null : String(raw).trim() || null;
    if (typeof orderId !== "string" || typeof status !== "string") {
      return { success: false, message: messages.admin.adminActionFailed };
    }
    await updateOrderStatusAction(orderId, status, trackingNumber);
    return { success: true, message: messages.admin.orderUpdateSuccess };
  } catch {
    return { success: false, message: messages.admin.adminActionFailed };
  }
}
