"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { handleSupabaseError } from "@/lib/utils/supabase-errors";

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
  name_ro?: string | null;
  description?: string;
  price: number;
  images?: string[];
  material_options?: string[];
  featured?: boolean;
  seasonal?: boolean;
  product_type?: "custom" | "seasonal";
  category?: string;
  custom_config?: Record<string, any>;
}) {
  await requireAdmin();
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      ...product,
      material_options: product.material_options || [],
      images: product.images || [],
    })
    .select();

  if (error) {
    throw new Error(error.message || "Failed to create product");
  }

  revalidatePath("/admin/products");
  return data?.[0] || null;
}

/**
 * Server action to update a product
 */
export async function updateProductAction(
  id: string,
  updates: Partial<{
    name: string;
    name_ro?: string | null;
    description: string;
    price: number;
    images: string[];
    material_options: string[];
    featured: boolean;
    seasonal?: boolean;
    product_type?: "custom" | "seasonal";
    category?: string;
    custom_config?: Record<string, any>;
  }>
) {
  await requireAdmin();
  
  const supabase = await createClient();
  
  // First verify the product exists
  const { data: existing, error: fetchError } = await supabase
    .from("products")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  
  if (fetchError) {
    throw handleSupabaseError(fetchError);
  }
  
  if (!existing) {
    throw new Error("Product not found");
  }
  
  // Perform the update
  const { data, error } = await supabase
    .from("products")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select();

  if (error) {
    throw handleSupabaseError(error);
  }

  revalidatePath("/admin/products");
  revalidatePath(`/products/${id}`);
  return data?.[0] || null;
}

/**
 * Server action to delete a product
 */
export async function deleteProductAction(productId: string) {
  await requireAdmin();
  
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw handleSupabaseError(error);
  }

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
