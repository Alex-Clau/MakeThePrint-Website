import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleSupabaseError } from "@/lib/utils/supabase-errors";
import { apiErrorResponse, normalizeToApiError } from "@/lib/utils/api-error";
import {
  getProductReviewsPaginated,
  getProductReviewStatsForProduct,
  type ReviewSort,
} from "@/lib/supabase/reviews";

const REVIEW_SORT_OPTIONS: ReadonlyArray<ReviewSort> = ["newest", "oldest", "highest", "lowest"];
const MAX_REVIEW_COMMENT_LENGTH = 1000;

function isValidReviewSort(value: string): value is ReviewSort {
  return REVIEW_SORT_OPTIONS.includes(value as ReviewSort);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("product_id");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") ?? "5", 10)));
    const requestedSort = searchParams.get("sort") ?? "newest";

    if (!productId) {
      return apiErrorResponse("product_id is required", 400);
    }
    if (!isValidReviewSort(requestedSort)) {
      return apiErrorResponse("Invalid sort value", 400);
    }
    const sort = requestedSort;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { reviews, total } = await getProductReviewsPaginated(productId, page, limit, sort);
    const stats =
      page === 1
        ? await getProductReviewStatsForProduct(productId)
        : { averageRating: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number> };

    let userReview = null;
    if (user) {
      const { data } = await supabase
        .from("product_reviews")
        .select("id, user_id, rating, comment, created_at, updated_at")
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        userReview = {
          id: data.id,
          user_id: data.user_id,
          rating: data.rating,
          comment: data.comment ?? undefined,
          created_at: data.created_at,
          updated_at: data.updated_at ?? undefined,
        };
      }
    }

    const hasMore = page * limit < total;

    return NextResponse.json({
      reviews,
      total,
      averageRating: stats.averageRating,
      distribution: stats.distribution,
      hasMore,
      userReview,
    });
  } catch (error: unknown) {
    const { message } = normalizeToApiError(error);
    return apiErrorResponse(message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return apiErrorResponse("Unauthorized. Please sign in to leave a review.", 401, "UNAUTHORIZED");
    }

    const body = await request.json();
    const { product_id, rating, comment } = body as {
      product_id?: string;
      rating?: unknown;
      comment?: unknown;
    };

    if (!product_id) {
      return apiErrorResponse("Product ID is required", 400);
    }
    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return apiErrorResponse("Rating must be an integer between 1 and 5", 400);
    }
    if (comment != null && typeof comment !== "string") {
      return apiErrorResponse("Comment must be a string", 400);
    }
    if (typeof comment === "string" && comment.length > MAX_REVIEW_COMMENT_LENGTH) {
      return apiErrorResponse(`Comment must be ${MAX_REVIEW_COMMENT_LENGTH} characters or less`, 400);
    }

    // Check if user already reviewed this product
    const { data: existingReview } = await supabase
      .from("product_reviews")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product_id)
      .maybeSingle();

    if (existingReview) {
      return apiErrorResponse("You have already reviewed this product", 400);
    }

    // Create review
    const { data, error } = await supabase
      .from("product_reviews")
      .insert({
        user_id: user.id,
        product_id,
        rating: parsedRating,
        comment: comment || null,
      })
      .select()
      .single();

    if (error) {
      // Check if it's a foreign key constraint error
      if (error.code === '23503' || error.message?.includes('foreign key')) {
        return apiErrorResponse("User profile not found. Please ensure your account is properly set up.", 400);
      }
      
      // Check if it's an RLS policy violation
      if (error.code === '42501' || error.message?.includes('row-level security') || error.message?.includes('policy')) {
        return apiErrorResponse("Permission denied. Please ensure you're signed in and try again.", 403);
      }
      
      const handledError = handleSupabaseError(error);
      return apiErrorResponse(handledError.message || "Failed to create review", 500);
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const { message } = normalizeToApiError(error);
    return apiErrorResponse(message, 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return apiErrorResponse("Unauthorized", 401, "UNAUTHORIZED");
    }

    const body = await request.json();
    const { review_id, rating, comment } = body as {
      review_id?: string;
      rating?: unknown;
      comment?: unknown;
    };

    if (!review_id) {
      return apiErrorResponse("review_id is required", 400);
    }
    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return apiErrorResponse("Rating must be an integer between 1 and 5", 400);
    }
    if (comment != null && typeof comment !== "string") {
      return apiErrorResponse("Comment must be a string", 400);
    }
    if (typeof comment === "string" && comment.length > MAX_REVIEW_COMMENT_LENGTH) {
      return apiErrorResponse(`Comment must be ${MAX_REVIEW_COMMENT_LENGTH} characters or less`, 400);
    }

    // Update review
    const { data, error } = await supabase
      .from("product_reviews")
      .update({
        rating: parsedRating,
        comment: comment || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", review_id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error);
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const { message } = normalizeToApiError(error);
    return apiErrorResponse(message, 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return apiErrorResponse("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("review_id");

    if (!reviewId) {
      return apiErrorResponse("Review ID is required", 400);
    }

    // Delete review
    const { data: deletedReview, error } = await supabase
      .from("product_reviews")
      .delete()
      .eq("id", reviewId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      throw handleSupabaseError(error);
    }
    if (!deletedReview) {
      return apiErrorResponse("Review not found", 404, "NOT_FOUND");
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const { message } = normalizeToApiError(error);
    return apiErrorResponse(message, 500);
  }
}

