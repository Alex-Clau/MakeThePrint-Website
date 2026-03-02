import { createClient } from "./server";
import { handleSupabaseError } from "../utils/supabase-errors";
import type { Review } from "@/types/product-components";

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

/**
 * Get reviews for a product, normalized to the Review type used in components.
 */
export async function getProductReviews(productId: string): Promise<Review[]> {
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
    .order("created_at", { ascending: false });

  if (error) {
    throw handleSupabaseError(error);
  }

  const reviews: Review[] = (data ?? []).map((item: any) => ({
    id: item.id,
    rating: item.rating,
    comment: item.comment ?? undefined,
    created_at: item.created_at,
    updated_at: item.updated_at ?? undefined,
    user_id: item.user_id,
    user_profiles: Array.isArray(item.user_profiles) && item.user_profiles.length > 0
      ? {
          full_name: item.user_profiles[0]?.full_name ?? undefined,
          email: item.user_profiles[0]?.email ?? undefined,
        }
      : undefined,
  }));

  return reviews;
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

