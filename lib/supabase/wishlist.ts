import { createClient } from "./server";
import { handleSupabaseError } from "../utils/supabase-errors";

/**
 * Get user's wishlist
 */
export async function getWishlist(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlist")
    .select(
      `
      *,
      products (
        id,
        name,
        price,
        images
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw handleSupabaseError(error);
  }
  return data;
}

/**
 * Add product to wishlist
 */
export async function addToWishlist(userId: string, productId: string) {
  const supabase = await createClient();

  // Check if already in wishlist
  const { data: existing } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    return existing; // Already in wishlist
  }

  const { data, error } = await supabase
    .from("wishlist")
    .insert({
      user_id: userId,
      product_id: productId,
    })
    .select()
    .single();

  if (error) {
    throw handleSupabaseError(error);
  }
  return data;
}

/**
 * Remove product from wishlist
 */
export async function removeFromWishlist(userId: string, productId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) {
    throw handleSupabaseError(error);
  }
  return { success: true };
}

/**
 * Check if product is in wishlist
 */
export async function isInWishlist(userId: string, productId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    throw handleSupabaseError(error);
  }
  return !!data;
}

