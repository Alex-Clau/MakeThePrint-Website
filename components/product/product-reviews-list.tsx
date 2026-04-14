"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";
import { CreateReviewForm } from "./create-review-form";
import { createClient } from "@/lib/supabase/client";
import { ProductReviewsListProps } from "@/types/product-components";
import { messages } from "@/lib/messages";
import type { Review } from "@/types/product-components";
import { toast } from "sonner";

type SortOption = "newest" | "oldest" | "highest" | "lowest";

export function ProductReviewsList({
  initialReviews,
  currentUserId,
  averageRating,
  totalReviews,
  distribution,
  productId,
  initialHasMore,
  userReview,
  userDisplayName,
}: ProductReviewsListProps) {
  const t = messages.reviews;
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(currentUserId);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);

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

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    stars: star,
    count: distribution[star] ?? 0,
  }));

  const fetchMore = useCallback(
    async (sort: SortOption, pageNum: number, append: boolean) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsLoading(true);
      try {
        const query = new URLSearchParams({
          product_id: productId,
          page: String(pageNum),
          limit: "5",
          sort,
        });
        const res = await fetch(
          `/api/reviews?${query.toString()}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to fetch");
        const newReviews = data.reviews ?? [];
        setReviews((prev) => (append ? [...prev, ...newReviews] : newReviews));
        setHasMore(data.hasMore ?? false);
      } catch {
        toast.error(t.failedToLoadReviews);
        setHasMore(false);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [productId, t.failedToLoadReviews]
  );

  useEffect(() => {
    if (sortBy !== "newest") {
      pageRef.current = 1;
      setReviews([]);
      fetchMore(sortBy, 1, false);
    } else {
      setReviews(initialReviews);
      pageRef.current = 1;
      setHasMore(initialHasMore);
    }
  }, [sortBy, fetchMore, initialHasMore, initialReviews]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting || isLoading) return;
        const nextPage = pageRef.current + 1;
        pageRef.current = nextPage;
        fetchMore(sortBy, nextPage, true);
      },
      { rootMargin: "100px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, sortBy, fetchMore]);

  const handleSortChange = (v: string) => {
    setSortBy(v as SortOption);
  };

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

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {renderStars(Math.round(averageRating), "lg")}
            <span className="text-2xl font-bold">
              {averageRating.toFixed(2)} {t.outOf5}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {t.basedOn} {totalReviews} {totalReviews === 1 ? t.review : t.reviews}
          </div>
          {totalReviews === 0 && (
            <div className="mt-1 text-xs text-muted-foreground/80">
              {t.noReviewsYet}
            </div>
          )}
        </div>

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

      {/* Write Review Button and Sort Options */}
      <div className="flex items-center justify-between border-t border-accent-primary/30 pt-4">
        <h3 className="text-lg font-semibold">{t.customerReviews}</h3>
        <div className="flex items-center gap-4">
          {userId && !showReviewForm && (
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              {t.writeReview}
            </Button>
          )}
          {totalReviews > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  {sortBy === "newest" && t.newest}
                  {sortBy === "oldest" && t.oldest}
                  {sortBy === "highest" && t.highestRating}
                  {sortBy === "lowest" && t.lowestRating}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuRadioGroup value={sortBy} onValueChange={handleSortChange}>
                  <DropdownMenuRadioItem value="newest">{t.newest}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">{t.oldest}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="highest">{t.highestRating}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="lowest">{t.lowestRating}</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && userId && (
        <div className="border-t border-accent-primary/30 pt-6">
          <CreateReviewForm
            productId={productId}
            userId={userId}
            userReview={userReview}
            userDisplayName={userDisplayName}
            onClose={() => setShowReviewForm(false)}
          />
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => {
            const reviewDate = new Date(review.created_at);
            const userName = review.user_profiles?.full_name || "Anonymous";

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

      <div ref={sentinelRef} className="h-10 flex items-center justify-center">
        {isLoading && (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
      </div>

      {!hasMore && totalReviews > 0 && reviews.length > 5 && (
        <p className="text-center text-xs text-muted-foreground py-2">
          {t.endOfReviews}
        </p>
      )}
    </div>
  );
}
