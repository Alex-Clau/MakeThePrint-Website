import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleSupabaseError } from "@/lib/utils/supabase-errors";

// Ratings are now calculated dynamically from reviews table
// No need to update product columns

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to leave a review." },
        { status: 401 }
      );
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
      .select("*")
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
      // Log the full error for debugging
      console.error("Review creation error:", JSON.stringify(error, null, 2));
      console.error("User ID:", user.id);
      console.error("Product ID:", product_id);
      console.error("Rating:", rating);
      
      // Check if it's a foreign key constraint error
      if (error.code === '23503' || error.message?.includes('foreign key')) {
        return NextResponse.json(
          { error: "User profile not found. Please ensure your account is properly set up." },
          { status: 400 }
        );
      }
      
      // Check if it's an RLS policy violation
      if (error.code === '42501' || error.message?.includes('row-level security') || error.message?.includes('policy')) {
        return NextResponse.json(
          { error: "Permission denied. Please ensure you're signed in and try again." },
          { status: 403 }
        );
      }
      
      const handledError = handleSupabaseError(error);
      return NextResponse.json(
        { error: handledError.message || "Failed to create review", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Unexpected error in review creation:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete review" },
      { status: 500 }
    );
  }
}

