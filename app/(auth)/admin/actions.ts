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
  custom_config?: Record<string, any>;
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
    custom_config?: Record<string, any>;
  }>
) {
  await requireAdmin();
  await getProductById(id);
  const data = await updateProduct(id, updates);
  revalidatePath("/admin/products");
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
  const { updateOrderStatusAdmin } = await import("@/lib/supabase/orders-admin");
  await updateOrderStatusAdmin(orderId, status, trackingNumber);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

/**
 * Revalidate pages that display product cards (and wishlist state).
 * Call after client-side wishlist add/remove so navigation to those routes shows fresh data.
 */
export async function revalidateWishlistPaths() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/collections");
}

/**
 * Form action for admin order status update
 */
export async function updateOrderStatusFormAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as string;
  const raw = formData.get("trackingNumber");
  const trackingNumber =
    raw === null || raw === undefined || raw === "" ? null : String(raw).trim() || null;
  await updateOrderStatusAction(orderId, status, trackingNumber);
}
