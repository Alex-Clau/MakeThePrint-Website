import { createClient } from "./server";
import { handleSupabaseError } from "../utils/supabase-errors";

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw handleSupabaseError(error);
  }
  return data;
}

/**
 * Create or update user profile
 */
export async function upsertUserProfile(profile: {
  id: string;
  email?: string;
  full_name?: string;
  phone?: string;
  shipping_addresses?: Record<string, any>[];
  preferences?: Record<string, any>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      {
        ...profile,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      }
    )
    .select()
    .single();

  if (error) {
    throw handleSupabaseError(error);
  }
  return data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    email: string;
    full_name: string;
    phone: string;
    shipping_addresses: Record<string, any>[];
    preferences: Record<string, any>;
  }>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw handleSupabaseError(error);
  }
  return data;
}

/**
 * Add shipping address to user profile
 */
export async function addShippingAddress(
  userId: string,
  address: Record<string, any>
) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("shipping_addresses")
    .eq("id", userId)
    .single();

  const addresses = (profile?.shipping_addresses as any[]) || [];
  addresses.push(address);

  const { data, error } = await supabase
    .from("user_profiles")
    .update({
      shipping_addresses: addresses,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw handleSupabaseError(error);
  }
  return data;
}

