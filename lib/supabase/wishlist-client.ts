"use client";

import { createClient } from "./client";

/**
 * Add product to wishlist - Client-side
 */
export async function addToWishlistClient(userId: string, productId: string) {
  const supabase = createClient();

  // Check if already in wishlist
  const { data: existing } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from("wishlist")
    .insert({
      user_id: userId,
      product_id: productId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Remove product from wishlist - Client-side
 */
export async function removeFromWishlistClient(
  userId: string,
  productId: string
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw error;
  return { success: true };
}

