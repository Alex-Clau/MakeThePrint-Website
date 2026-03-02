import { createClient } from "./server";
import { createAdminClient } from "./admin";
import { handleSupabaseError } from "../utils/supabase-errors";
import type { CartContentProps } from "@/types/cart";

/**
 * Get user's cart items, normalized to typed CartItem objects.
 */
export async function getCartItems(userId: string): Promise<CartContentProps["items"]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cart")
    .select(
      `
      id,
      user_id,
      product_id,
      quantity,
      material,
      customizations,
      created_at,
      updated_at,
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
  const items: CartContentProps["items"] = (data ?? []).map((item: any) => ({
    id: item.id,
    user_id: item.user_id,
    product_id: item.product_id,
    quantity: item.quantity,
    material: item.material,
    customizations: item.customizations,
    created_at: item.created_at,
    updated_at: item.updated_at,
    products: Array.isArray(item.products) ? item.products[0] : item.products,
  }));

  return items;
}

/**
 * Add item to cart (or update quantity if exists)
 */
export async function addToCart(item: {
  user_id: string;
  product_id: string;
  quantity: number;
  material?: string;
  customizations?: Record<string, any>;
}) {
  const supabase = await createClient();

  // Check if item already exists with same material and customizations
  const {data: existingItem} = await supabase
    .from("cart")
    .select("id, quantity")
    .eq("user_id", item.user_id)
    .eq("product_id", item.product_id)
    .eq("material", item.material || "")
    .eq("customizations", JSON.stringify(item.customizations || {}))
    .maybeSingle();

  if (existingItem) {
    // Update quantity
    const {data, error} = await supabase
      .from("cart")
      .update({
        quantity: existingItem.quantity + item.quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingItem.id)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error);
    }
    return data;
  } else {
    // Insert new item
    const {data, error} = await supabase
      .from("cart")
      .insert({
        ...item,
        customizations: item.customizations || {},
      })
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error);
    }
    return data;
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
  cartItemId: string,
  quantity: number
) {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from("cart")
    .update({
      quantity,
      updated_at: new Date().toISOString(),
    })
    .eq("id", cartItemId)
    .select()
    .single();

  if (error) {
    throw handleSupabaseError(error);
  }
  return data;
}

/**
 * Remove item from cart
 */
export async function removeFromCart(cartItemId: string) {
  const supabase = await createClient();
  const {error} = await supabase.from("cart")
                                .delete()
                                .eq("id", cartItemId);

  if (error) {
    throw handleSupabaseError(error);
  }
  return {success: true};
}

/**
 * Clear user's entire cart
 */
export async function clearCart(userId: string) {
  const supabase = await createClient();
  const {error} = await supabase.from("cart")
                                .delete()
                                .eq("user_id", userId);

  if (error) {
    throw handleSupabaseError(error);
  }
  return {success: true};
}

/**
 * Clear user's cart using admin client (e.g. webhook, no user session).
 */
export async function clearCartAdmin(userId: string) {
  const supabase = createAdminClient();
  return supabase.from("cart").delete().eq("user_id", userId);
}

