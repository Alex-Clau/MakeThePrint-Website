import { createClient } from "./server";
import { handleSupabaseError } from "../utils/supabase-errors";
import type { AddressFormData } from "@/types/address";

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select(
      "id, email, full_name, phone, shipping_addresses, preferences, is_admin, created_at, updated_at"
    )
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
  shipping_addresses?: Record<string, unknown>[];
  preferences?: Record<string, unknown>;
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
    shipping_addresses: Record<string, unknown>[];
    preferences: Record<string, unknown>;
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
  address: AddressFormData
) {
  const supabase = await createClient();
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("shipping_addresses")
    .eq("id", userId)
    .single();

  if (profileError) {
    throw handleSupabaseError(profileError);
  }

  const raw = profile?.shipping_addresses;
  const addresses: AddressFormData[] = Array.isArray(raw)
    ? [...(raw as AddressFormData[])]
    : [];
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

