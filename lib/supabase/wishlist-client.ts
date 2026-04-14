"use client";

import { createClient } from "./client";
import { handleSupabaseError } from "../utils/supabase-errors";
import { getApiErrorBody } from "@/lib/utils/api-error";

/**
 * Add product to wishlist - Client-side
 */
export async function addToWishlistClient(userId: string, productId: string) {
  const supabase = createClient();

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

  if (error) throw handleSupabaseError(error);
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

  if (error) throw handleSupabaseError(error);
  return { success: true };
}

const WISHLIST_IDS_PATH = "/api/wishlist/ids";

/**
 * Loads wishlist product IDs from the cookie-backed API route.
 * On any failure, returns `{ ok: false }` so callers can keep the previous UI state.
 */
export async function fetchWishlistProductIdsFromApi(
  init?: RequestInit
): Promise<{ ok: true; productIds: string[] } | { ok: false }> {
  try {
    const res = await fetch(WISHLIST_IDS_PATH, init);
    if (!res.ok) {
      const { message } = await getApiErrorBody(res);
      console.error("[fetchWishlistProductIdsFromApi]", res.status, message);
      return { ok: false };
    }
    const data = (await res.json()) as { productIds?: unknown };
    const raw = data.productIds;
    const productIds = Array.isArray(raw)
      ? raw.filter((id): id is string => typeof id === "string")
      : [];
    return { ok: true, productIds };
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      return { ok: false };
    }
    console.error("[fetchWishlistProductIdsFromApi]", e);
    return { ok: false };
  }
}

