import { createClient } from "./server";
import { handleSupabaseError } from "../utils/supabase-errors";
import type { WishlistContentProps } from "@/types/wishlist";

/**
 * Get user's wishlist, normalized to the shape expected by WishlistContent.
 */
export async function getWishlist(userId: string): Promise<WishlistContentProps["items"]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlist")
    .select(
      `
      id,
      user_id,
      product_id,
      created_at,
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

  const items: WishlistContentProps["items"] = (data ?? []).map((item: any) => ({
    id: item.id,
    product_id: item.product_id,
    products: Array.isArray(item.products) ? item.products[0] : item.products,
  }));

  return items;
}

/**
 * Add product to wishlist
 */
export async function addToWishlist(userId: string, productId: string) {
  const supabase = await createClient();

  // Check if already in wishlist
  const { data: existing } = await supabase
    .from("wishlist")
    .select("id")
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
 * Get all product IDs in user's wishlist (for batch checks).
 */
export async function getWishlistProductIds(userId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlist")
    .select("product_id")
    .eq("user_id", userId);

  if (error) {
    throw handleSupabaseError(error);
  }
  return new Set((data ?? []).map((row: { product_id: string }) => row.product_id));
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

