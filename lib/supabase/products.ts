import { createClient } from "./server";
import { Product } from "@/types/product";
import { handleSupabaseError } from "../utils/supabase-errors";

/**
 * Get all products with optional filters
 */
export async function getProducts(options?: {
  featured?: boolean;
  seasonal?: boolean;
  product_type?: string | string[];
  limit?: number;
  offset?: number;
  search?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*");

  if (options?.featured !== undefined) {
    query = query.eq("featured", options.featured);
  }

  if (options?.seasonal !== undefined) {
    query = query.eq("seasonal", options.seasonal);
  }

  if (options?.product_type) {
    if (Array.isArray(options.product_type)) {
      query = query.in("product_type", options.product_type);
    } else {
      query = query.eq("product_type", options.product_type);
    }
  }

  if (options?.search) {
    query = query.or(
      `name.ilike.%${options.search}%,description.ilike.%${options.search}%`
    );
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw handleSupabaseError(error);
  }
  return data;
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw handleSupabaseError(error);
  }
  return data;
}

/**
 * Create a new product
 */
export async function createProduct(product: {
  name: string;
  description?: string;
  price: number;
  images?: string[];
  material_options?: string[];
  featured?: boolean;
  seasonal?: boolean;
  product_type?: "custom" | "seasonal";
  category?: string;
  custom_config?: Record<string, any>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      ...product,
      material_options: product.material_options || [],
      images: product.images || [],
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to create product");
  }
  return data;
}

/**
 * Update a product
 */
export async function updateProduct(
  id: string,
  updates: Partial<{
    name: string;
    description: string;
    price: number;
    images: string[];
    material_options: string[];
    featured: boolean;
    seasonal?: boolean;
    product_type?: "custom" | "seasonal";
    category?: string;
    custom_config?: Record<string, any>;
  }>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw handleSupabaseError(error);
  }
  return data;
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete()    .eq("id", id);

  if (error) {
    throw handleSupabaseError(error);
  }
  return { success: true };
}

