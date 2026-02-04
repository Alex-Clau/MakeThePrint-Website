"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { handleSupabaseError } from "@/lib/utils/supabase-errors";

/**
 * Check if current user is admin
 */
async function requireAdmin() {
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
