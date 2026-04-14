import { createClient } from "./server";
import { handleSupabaseError } from "../utils/supabase-errors";
import type { WishlistRow } from "@/types/wishlist";

/**
 * Get user's wishlist, normalized for UI.
 */
export async function getWishlist(userId: string): Promise<WishlistRow[]> {
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

  type WishlistJoinRow = {
    id: string;
    product_id: string;
    products: WishlistRow["products"] | WishlistRow["products"][] | null;
  };

  return ((data ?? []) as WishlistJoinRow[])
    .map((item) => {
      const rel = item.products;
      const product = Array.isArray(rel) ? rel[0] : rel;
      if (!product?.id) return null;
      return {
        id: item.id,
        product_id: item.product_id,
        products: product,
      } satisfies WishlistRow;
    })
    .filter((row): row is WishlistRow => row != null);
}

/**
 * Add product to wishlist
 */
export async function addToWishlist(userId: string, productId: string) {
  const supabase = await createClient();

  // Check if already in wishlist
  const { data: existing, error: existingError } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existingError) {
    throw handleSupabaseError(existingError);
  }

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

