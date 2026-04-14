"use client";

import { createClient } from "./client";
import { handleSupabaseError } from "../utils/supabase-errors";

/**
 * Client-side cart operations (for use in Client Components)
 */

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObjectKeys);
  }
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortObjectKeys((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return value;
}

function normalizeCustomizations(
  customizations?: Record<string, unknown>
): Record<string, unknown> {
  return (sortObjectKeys(customizations ?? {}) as Record<string, unknown>) ?? {};
}

export async function addToCartClient(item: {
  user_id: string;
  product_id: string;
  quantity: number;
  material?: string;
  customizations?: Record<string, unknown>;
}) {
  const supabase = createClient();
  const normalizedCustomizations = normalizeCustomizations(item.customizations);

  // Check if item already exists
  // Build query conditionally to handle empty/null material
  let query = supabase
    .from("cart")
    .select("id, quantity")
    .eq("user_id", item.user_id)
    .eq("product_id", item.product_id)
    .eq("customizations", JSON.stringify(normalizedCustomizations));
  
  // Only filter by material if it's provided and not empty
  if (item.material && item.material.trim() !== "") {
    query = query.eq("material", item.material);
  } else {
    // Match items where material is null or empty string
    query = query.or("material.is.null,material.eq.");
  }
  
  const { data: existingItem, error: findError } = await query.maybeSingle();
  if (findError) throw handleSupabaseError(findError);

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

    if (error) throw handleSupabaseError(error);
    return data;
  } else {
    const { data, error } = await supabase
      .from("cart")
      .insert({
        ...item,
        customizations: normalizedCustomizations,
      })
      .select()
      .single();

    if (error) throw handleSupabaseError(error);
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

  if (error) throw handleSupabaseError(error);
  return data;
}

export async function removeFromCartClient(cartItemId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("cart").delete().eq("id", cartItemId);

  if (error) throw handleSupabaseError(error);
  return { success: true };
}

