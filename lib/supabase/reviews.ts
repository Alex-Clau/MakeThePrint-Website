import { createClient } from "./server";
import { handleSupabaseError } from "../utils/supabase-errors";

/**
 * Get reviews for a product
 */
export async function getProductReviews(productId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_reviews")
    .select(
      `
      *,
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
  return data;
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
    .select("*")
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

