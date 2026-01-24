import { getProductReviews } from "@/lib/supabase/reviews";
import { getProductById } from "@/lib/supabase/products";
import { ProductReviewsList } from "./product-reviews-list";
import { ProductReviewsProps } from "@/types/product-components";

export async function ProductReviews({ productId, userId }: ProductReviewsProps) {
  const reviews = await getProductReviews(productId);

  // Calculate average rating and count directly from reviews
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  const totalReviews = reviews.length;

  return (
    <div className="space-y-6 border-t border-accent-primary/30 pt-4 sm:pt-6 lg:pt-8 relative z-10">
      <ProductReviewsList
        reviews={reviews}
        currentUserId={userId}
        averageRating={averageRating}
        totalReviews={totalReviews}
        productId={productId}
      />
    </div>
  );
}

