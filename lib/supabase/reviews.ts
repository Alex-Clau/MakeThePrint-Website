import { createClient } from "./server";
import { handleSupabaseError } from "../utils/supabase-errors";
import type { Review } from "@/types/product-components";

/** Resolve user_profiles from Supabase join (PostgREST many-to-one returns object, not array) */
function resolveUserProfiles(raw: unknown): Review["user_profiles"] {
  if (!raw || typeof raw !== "object") return undefined;
  const p = raw as { full_name?: string; email?: string };
  return {
    full_name: p.full_name ?? undefined,
    email: p.email ?? undefined,
  };
}

function mapReviewRow(item: Record<string, unknown>): Review {
  return {
    id: item.id as string,
    rating: item.rating as number,
    comment: (item.comment as string) ?? undefined,
    created_at: item.created_at as string,
    updated_at: (item.updated_at as string) ?? undefined,
    user_id: item.user_id as string,
    user_profiles: resolveUserProfiles(item.user_profiles),
  };
}

/**
 * Get aggregate rating and review count for multiple products (for listing cards).
 */
export async function getProductReviewStats(productIds: string[]): Promise<
  Map<string, { rating: number; review_count: number }>
> {
  if (productIds.length === 0) return new Map();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_reviews")
    .select("product_id, rating")
    .in("product_id", productIds);

  if (error) {
    throw handleSupabaseError(error);
  }

  const map = new Map<string, { sum: number; count: number }>();
  for (const row of data ?? []) {
    const cur = map.get(row.product_id) ?? { sum: 0, count: 0 };
    cur.sum += row.rating;
    cur.count += 1;
    map.set(row.product_id, cur);
  }

  const result = new Map<string, { rating: number; review_count: number }>();
  map.forEach(({ sum, count }, productId) => {
    result.set(productId, {
      rating: Math.round((sum / count) * 100) / 100,
      review_count: count,
    });
  });
  return result;
}

export type ReviewSort = "newest" | "oldest" | "highest" | "lowest";

function getOrderForSort(sort: ReviewSort): { column: string; ascending: boolean }[] {
  switch (sort) {
    case "newest":
      return [{ column: "created_at", ascending: false }];
    case "oldest":
      return [{ column: "created_at", ascending: true }];
    case "highest":
      return [{ column: "rating", ascending: false }, { column: "created_at", ascending: false }];
    case "lowest":
      return [{ column: "rating", ascending: true }, { column: "created_at", ascending: false }];
    default:
      return [{ column: "created_at", ascending: false }];
  }
}

/**
 * Get paginated reviews for a product.
 */
export async function getProductReviewsPaginated(
  productId: string,
  page: number,
  limit: number,
  sort: ReviewSort = "newest"
): Promise<{ reviews: Review[]; total: number }> {
  const supabase = await createClient();
  const order = getOrderForSort(sort);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("product_reviews")
    .select(
      `
      id,
      user_id,
      product_id,
      rating,
      comment,
      created_at,
      updated_at,
      user_profiles (
        id,
        full_name,
        email
      )
    `,
      { count: "exact" }
    )
    .eq("product_id", productId);

  for (const o of order) {
    query = query.order(o.column, { ascending: o.ascending });
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw handleSupabaseError(error);
  }

  const reviews: Review[] = (data ?? []).map((item) => mapReviewRow(item as Record<string, unknown>));

  return { reviews, total: count ?? 0 };
}

/**
 * Get rating stats for a single product (average, total, distribution).
 */
export async function getProductReviewStatsForProduct(productId: string): Promise<{
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_reviews")
    .select("rating")
    .eq("product_id", productId);

  if (error) {
    throw handleSupabaseError(error);
  }

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const row of data ?? []) {
    distribution[row.rating as number] = (distribution[row.rating as number] ?? 0) + 1;
    sum += row.rating;
  }
  const totalReviews = data?.length ?? 0;
  const averageRating = totalReviews > 0 ? Math.round((sum / totalReviews) * 100) / 100 : 0;

  return { averageRating, totalReviews, distribution };
}

/**
 * Get the current user's review for a product (if any).
 */
export async function getUserReview(
  productId: string,
  userId: string
): Promise<Review | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_reviews")
    .select(
      `
      id,
      user_id,
      product_id,
      rating,
      comment,
      created_at,
      updated_at,
      user_profiles (
        id,
        full_name,
        email
      )
    `
    )
    .eq("product_id", productId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return mapReviewRow(data as Record<string, unknown>);
}

/**
 * Create a product review
 */
export async function createReview(review: {
  user_id: string;
  product_id: string;
  rating: number;
  comment?: string;
}) {
  const supabase = await createClient();

  // Check if user already reviewed this product
  const { data: existingReview } = await supabase
    .from("product_reviews")
    .select("id")
    .eq("user_id", review.user_id)
    .eq("product_id", review.product_id)
    .maybeSingle();

  if (existingReview) {
    throw new Error("You have already reviewed this product");
  }

  // Create review
  const { data, error } = await supabase
    .from("product_reviews")
    .insert(review)
    .select()
    .single();

  if (error) {
    throw handleSupabaseError(error);
  }

  // Note: Product ratings are now calculated dynamically from reviews
  // No need to update product columns

  return data;
}

/**
 * Update a review
 */
export async function updateReview(
  reviewId: string,
  userId: string,
  updates: {
    rating?: number;
    comment?: string;
  }
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_reviews")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw handleSupabaseError(error);
  }

  // Note: Product ratings are now calculated dynamically from reviews
  // No need to update product columns

  return data;
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string, userId: string) {
  const supabase = await createClient();

  // Get product_id before deleting
  const { data: review } = await supabase
    .from("product_reviews")
    .select("product_id")
    .eq("id", reviewId)
    .single();

  const { error } = await supabase
    .from("product_reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", userId);

  if (error) {
    throw handleSupabaseError(error);
  }

  // Note: Product ratings are now calculated dynamically from reviews
  // No need to update product columns

  return { success: true };
}

