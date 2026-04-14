import { createClient } from "./server";
import type { CustomProductConfig, KeychainConfig, Product } from "@/types/product";
import { handleSupabaseError } from "../utils/supabase-errors";

/**
 * Get all products with optional filters
 */
export async function getProducts(options?: {
  featured?: boolean;
  product_type?: string | string[];
  limit?: number;
  offset?: number;
  search?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      "id, name, description, price, product_type, category, custom_config, featured, images, created_at, updated_at"
    );

  if (options?.featured !== undefined) {
    query = query.eq("featured", options.featured);
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
 * Public helpers for common product lists used on marketing pages.
 * These intentionally do not perform any user-specific logic so that
 * the calling pages can remain as cacheable as possible.
 */
export async function getPublicCustomProducts() {
  return getProducts({ product_type: "custom" });
}

export async function getPublicCustomProductsPage({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<{ products: Product[]; hasMore: boolean; total: number }> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("products")
    .select(
      "id, name, description, price, product_type, category, custom_config, featured, images, created_at, updated_at",
      { count: "exact" },
    )
    .eq("product_type", "custom")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw handleSupabaseError(error);
  }

  const total = count ?? data?.length ?? 0;
  const hasMore = total ? to + 1 < total : (data?.length ?? 0) === pageSize;

  return {
    products: (data ?? []) as Product[],
    hasMore,
    total,
  };
}

export async function getPublicSeasonalProducts(limit = 12) {
  return getProducts({ product_type: "seasonal", limit });
}

export async function getPublicFeaturedProducts(limit = 8) {
  return getProducts({ featured: true, limit });
}

/**
 * Paginated admin catalog (same columns/filters as legacy list, for infinite scroll).
 */
export async function getAdminProductsPage(params: {
  page: number;
  pageSize: number;
  type?: string;
  category?: string;
}): Promise<{ products: Product[]; hasMore: boolean }> {
  const supabase = await createClient();
  const { page, pageSize, type, category } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select(
      "id, name, description, price, images, featured, created_at, product_type, category",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (type) {
    query = query.eq("product_type", type);
  }
  if (category) {
    query = query.eq("category", category);
  }

  const { data, error, count } = await query.range(from, to);
  if (error) {
    throw handleSupabaseError(error);
  }

  const total = count ?? 0;
  const hasMore = total ? to + 1 < total : (data?.length ?? 0) === pageSize;

  return {
    products: (data ?? []) as Product[],
    hasMore,
  };
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, description, price, product_type, category, custom_config, featured, images, created_at, updated_at"
    )
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
  featured?: boolean;
  product_type?: "custom" | "seasonal";
  category?: string;
  custom_config?: CustomProductConfig | KeychainConfig;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      ...product,
      images: product.images || [],
    })
    .select(
      "id, name, description, price, product_type, category, custom_config, featured, images, created_at, updated_at"
    )
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
    featured: boolean;
    product_type?: "custom" | "seasonal";
    category?: string;
    custom_config?: CustomProductConfig | KeychainConfig;
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
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    throw handleSupabaseError(error);
  }
  return { success: true };
}

