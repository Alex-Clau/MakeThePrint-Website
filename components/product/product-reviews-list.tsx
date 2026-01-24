"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { CreateReviewForm } from "./create-review-form";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { ProductReviewsListProps } from "@/types/product-components";

export function ProductReviewsList({
  reviews,
  currentUserId,
  averageRating,
  totalReviews,
  productId,
}: ProductReviewsListProps) {
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(currentUserId);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);
    }
    if (!currentUserId) {
      getUser();
    }
  }, [currentUserId]);

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    stars: star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`${sizeClasses[size]} ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Rating Summary - Only show if there are reviews */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
          {/* Left: Overall Rating */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              {renderStars(Math.round(averageRating), "lg")}
              <span className="text-2xl font-bold">
                {averageRating.toFixed(2)} out of 5
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}</span>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
          </div>

          {/* Right: Rating Breakdown */}
          <div className="space-y-2">
            {ratingDistribution.map(({ stars, count }) => {
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-12">{stars} ★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          No reviews yet. Be the first to review this product!
        </div>
      )}

      {/* Write Review Button and Sort Options */}
      <div className="flex items-center justify-between border-t border-accent-primary/30 pt-4">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        <div className="flex items-center gap-4">
          {userId && !showReviewForm && (
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              Write a Review
            </Button>
          )}
          {reviews.length > 0 && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="gap-2"
              >
                {sortBy === "newest" && "Newest"}
                {sortBy === "oldest" && "Oldest"}
                {sortBy === "highest" && "Highest Rating"}
                {sortBy === "lowest" && "Lowest Rating"}
                <ChevronDown className={`h-4 w-4 transition-transform ${showSortMenu ? "rotate-180" : ""}`} />
              </Button>
              {showSortMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSortMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-accent-primary/20 rounded-lg shadow-lg z-20">
                    <button
                      onClick={() => {
                        setSortBy("newest");
                        setShowSortMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-accent-primary/10 transition-colors text-sm"
                    >
                      Newest
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("oldest");
                        setShowSortMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-accent-primary/10 transition-colors text-sm"
                    >
                      Oldest
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("highest");
                        setShowSortMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-accent-primary/10 transition-colors text-sm"
                    >
                      Highest Rating
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("lowest");
                        setShowSortMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-accent-primary/10 transition-colors text-sm"
                    >
                      Lowest Rating
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && userId && (
        <div className="border-t border-accent-primary/30 pt-6">
          <CreateReviewForm
            productId={productId}
            userId={userId}
            reviews={reviews}
            onClose={() => setShowReviewForm(false)}
          />
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {sortedReviews.map((review) => {
          const reviewDate = new Date(review.created_at);
          const userName =
            review.user_profiles?.full_name ||
            review.user_profiles?.email?.split("@")[0] ||
            "Anonymous";

          return (
            <Card key={review.id} className="border-accent-primary/20">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {renderStars(review.rating)}
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-yellow-400 flex items-center justify-center text-white text-xs font-semibold">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold">{userName}</span>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {review.comment}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {reviewDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
        </div>
      )}
    </div>
  );
}
