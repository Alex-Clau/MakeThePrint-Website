"use client";

import { createClient } from "./client";

/**
 * Client-side cart operations (for use in Client Components)
 */

export async function addToCartClient(item: {
  user_id: string;
  product_id: string;
  quantity: number;
  material?: string;
  customizations?: Record<string, any>;
}) {
  const supabase = createClient();

  // Check if item already exists
  // Build query conditionally to handle empty/null material
  let query = supabase
    .from("cart")
    .select("*")
    .eq("user_id", item.user_id)
    .eq("product_id", item.product_id);
  
  // Only filter by material if it's provided and not empty
  if (item.material && item.material.trim() !== "") {
    query = query.eq("material", item.material);
  } else {
    // Match items where material is null or empty string
    query = query.or("material.is.null,material.eq.");
  }
  
  const { data: existingItem } = await query.maybeSingle();

  if (existingItem) {
    const { data, error } = await supabase
      .from("cart")
      .update({
        quantity: existingItem.quantity + item.quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingItem.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from("cart")
      .insert({
        ...item,
        customizations: item.customizations || {},
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export async function updateCartItemClient(
  cartItemId: string,
  quantity: number
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cart")
    .update({
      quantity,
      updated_at: new Date().toISOString(),
    })
    .eq("id", cartItemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFromCartClient(cartItemId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("cart").delete().eq("id", cartItemId);

  if (error) throw error;
  return { success: true };
}

