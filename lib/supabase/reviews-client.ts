"use client";

/**
 * Create a product review - Client-side
 * Uses API route to ensure product rating is updated
 */
export async function createReviewClient(review: {
  user_id: string;
  product_id: string;
  rating: number;
  comment?: string;
}) {
  const response = await fetch("/api/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: review.product_id,
      rating: review.rating,
      comment: review.comment,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create review");
  }

  return response.json();
}

/**
 * Update a review - Client-side
 * Uses API route to ensure product rating is updated
 */
export async function updateReviewClient(
  reviewId: string,
  userId: string,
  updates: {
    rating?: number;
    comment?: string;
  },
  productId: string
) {
  const response = await fetch("/api/reviews", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      review_id: reviewId,
      rating: updates.rating,
      comment: updates.comment,
      product_id: productId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update review");
  }

  return response.json();
}

/**
 * Delete a review - Client-side
 * Uses API route to ensure product rating is updated
 */
export async function deleteReviewClient(reviewId: string, userId: string) {
  const response = await fetch(`/api/reviews?review_id=${reviewId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete review");
  }

  return response.json();
}

