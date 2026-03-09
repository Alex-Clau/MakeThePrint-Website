import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleSupabaseError } from "@/lib/utils/supabase-errors";
import { apiErrorResponse, normalizeToApiError } from "@/lib/utils/api-error";
import {
  getProductReviewsPaginated,
  getProductReviewStatsForProduct,
  type ReviewSort,
} from "@/lib/supabase/reviews";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("product_id");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") ?? "5", 10)));
    const sort = (searchParams.get("sort") ?? "newest") as ReviewSort;

    if (!productId) {
      return NextResponse.json({ error: "product_id is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const [{ reviews, total }, stats] = await Promise.all([
      getProductReviewsPaginated(productId, page, limit, sort),
      getProductReviewStatsForProduct(productId),
    ]);

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
    const { product_id, rating, comment } = body;

    if (!product_id || !rating) {
      return NextResponse.json(
        { error: "Product ID and rating are required" },
        { status: 400 }
      );
    }

    // Check if user already reviewed this product
    const { data: existingReview } = await supabase
      .from("product_reviews")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product_id)
      .maybeSingle();

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    // Create review
    const { data, error } = await supabase
      .from("product_reviews")
      .insert({
        user_id: user.id,
        product_id,
        rating,
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
    const { review_id, rating, comment, product_id } = body;

    // Update review
    const { data, error } = await supabase
      .from("product_reviews")
      .update({
        rating,
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
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    // Get product_id before deleting
    const { data: review } = await supabase
      .from("product_reviews")
      .select("product_id")
      .eq("id", reviewId)
      .single();

    if (!review) {
      return apiErrorResponse("Review not found", 404, "NOT_FOUND");
    }

    // Delete review
    const { error } = await supabase
      .from("product_reviews")
      .delete()
      .eq("id", reviewId)
      .eq("user_id", user.id);

    if (error) {
      throw handleSupabaseError(error);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const { message } = normalizeToApiError(error);
    return apiErrorResponse(message, 500);
  }
}

