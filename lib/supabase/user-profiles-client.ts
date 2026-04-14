"use client";

import { createClient } from "./client";
import { handleSupabaseError } from "../utils/supabase-errors";
import type { AddressFormData } from "@/types/address";
import type { Address } from "@/types/address-components";

/**
 * Add shipping address to user profile - Client-side
 */
export async function addShippingAddressClient(
  userId: string,
  address: AddressFormData
) {
  const supabase = createClient();
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

  if (error) throw handleSupabaseError(error);
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
    shipping_addresses: Address[];
    preferences: Record<string, unknown>;
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

  if (error) throw handleSupabaseError(error);
  return data;
}

