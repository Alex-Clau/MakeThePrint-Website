"use client";

import { getApiErrorBody } from "@/lib/utils/api-error";

/**
 * Create a product review - Client-side
 * Uses API route for authenticated writes
 */
export async function createReviewClient(review: {
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
    const { message, code } = await getApiErrorBody(response);
    const err = new Error(message || "Failed to create review") as Error & { code?: string };
    err.code = code;
    throw err;
  }

  return response.json();
}

/**
 * Update a review - Client-side
 * Uses API route for authenticated writes
 */
export async function updateReviewClient(
  reviewId: string,
  updates: {
    rating?: number;
    comment?: string;
  }
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
    }),
  });

  if (!response.ok) {
    const { message, code } = await getApiErrorBody(response);
    const err = new Error(message || "Failed to update review") as Error & { code?: string };
    err.code = code;
    throw err;
  }

  return response.json();
}

/**
 * Delete a review - Client-side
 * Uses API route for authenticated writes
 */
export async function deleteReviewClient(reviewId: string) {
  const response = await fetch(`/api/reviews?review_id=${reviewId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const { message, code } = await getApiErrorBody(response);
    const err = new Error(message || "Failed to delete review") as Error & { code?: string };
    err.code = code;
    throw err;
  }

  return response.json();
}

