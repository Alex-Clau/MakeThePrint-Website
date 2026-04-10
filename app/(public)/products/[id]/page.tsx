import { PageLayout } from "@/components/layout/page-layout";
import { AnimatedProductPageContent } from "@/components/product/animated-product-page-content";
import { ProductReviewsList } from "@/components/product/product-reviews-list";
import { getProductById } from "@/lib/supabase/products";
import {
  getProductReviewsPaginated,
  getProductReviewStatsForProduct,
  getUserReview,
} from "@/lib/supabase/reviews";
import { getUserProfile } from "@/lib/supabase/user-profiles";
import { isInWishlist } from "@/lib/supabase/wishlist";
import { transformProductToFull } from "@/lib/utils/products";
import { ProductPageParams } from "@/types/pages";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const REVIEWS_PAGE_SIZE = 5;

async function ProductMainContent({
  product,
  averageRating,
  totalReviews,
  isInWishlist: isInWishlistProp = false,
}: {
  product: NonNullable<Awaited<ReturnType<typeof getProductById>>>;
  averageRating: number;
  totalReviews: number;
  isInWishlist?: boolean;
}) {
  const transformedProduct = transformProductToFull(product);
  return (
    <AnimatedProductPageContent
      product={transformedProduct}
      averageRating={averageRating}
      totalReviews={totalReviews}
      isInWishlist={isInWishlistProp}
    />
  );
}

async function ReviewsContent({
  productId,
  initialReviews,
  userId,
  averageRating,
  totalReviews,
  distribution,
  initialHasMore,
  userReview,
  userDisplayName,
}: {
  productId: string;
  initialReviews: Awaited<ReturnType<typeof getProductReviewsPaginated>>["reviews"];
  userId: string | undefined;
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
  initialHasMore: boolean;
  userReview: Awaited<ReturnType<typeof getUserReview>>;
  userDisplayName?: string;
}) {
  return (
    <div
      id="reviews"
      className="space-y-6 border-t border-accent-primary/30 pt-4 sm:pt-6 lg:pt-8 relative z-10"
    >
      <ProductReviewsList
        key={`reviews-${productId}-${totalReviews}`}
        initialReviews={initialReviews}
        currentUserId={userId}
        averageRating={averageRating}
        totalReviews={totalReviews}
        distribution={distribution}
        productId={productId}
        initialHasMore={initialHasMore}
        userReview={userReview}
        userDisplayName={userDisplayName}
      />
    </div>
  );
}

export default async function ProductDetailPage({ params }: ProductPageParams) {
  const { id } = await params;
  const [product, { data: { user } }] = await Promise.all([
    getProductById(id),
    createClient().then((c) => c.auth.getUser()),
  ]);
  if (!product) notFound();

  const [stats, { reviews: initialReviews, total }, inWishlist, userReview, profile] =
    await Promise.all([
      getProductReviewStatsForProduct(id),
      getProductReviewsPaginated(id, 1, REVIEWS_PAGE_SIZE, "newest"),
      user?.id != null ? isInWishlist(user.id, id) : Promise.resolve(false),
      user?.id != null ? getUserReview(id, user.id) : Promise.resolve(null),
      user?.id != null ? getUserProfile(user.id) : Promise.resolve(null),
    ]);

  const initialHasMore = REVIEWS_PAGE_SIZE < total;

  return (
    <PageLayout padding="tight" contentClassName="py-4 sm:py-6 lg:py-12">
      <ProductMainContent
        product={product}
        averageRating={stats.averageRating}
        totalReviews={stats.totalReviews}
        isInWishlist={inWishlist}
      />
      <ReviewsContent
        productId={id}
        initialReviews={initialReviews}
        userId={user?.id}
        averageRating={stats.averageRating}
        totalReviews={stats.totalReviews}
        distribution={stats.distribution}
        initialHasMore={initialHasMore}
        userReview={userReview}
        userDisplayName={profile?.full_name ?? undefined}
      />
    </PageLayout>
  );
}
