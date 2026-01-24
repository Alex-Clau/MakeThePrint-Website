"use client";

import { createClient } from "./client";

/**
 * Add shipping address to user profile - Client-side
 */
export async function addShippingAddressClient(
  userId: string,
  address: Record<string, any>
) {
  const supabase = createClient();
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

  if (error) throw error;
  return data;
}

/**
 * Update user profile - Client-side
 */
export async function updateUserProfileClient(
  userId: string,
  updates: Partial<{
    email: string;
    full_name: string;
    phone: string;
    shipping_addresses: Record<string, any>[];
    preferences: Record<string, any>;
  }>
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

