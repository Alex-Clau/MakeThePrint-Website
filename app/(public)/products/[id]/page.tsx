import { PageLayout } from "@/components/layout/page-layout";
import { AnimatedProductPageContent } from "@/components/product/animated-product-page-content";
import { ProductReviewsList } from "@/components/product/product-reviews-list";
import { getProductById } from "@/lib/supabase/products";
import { getProductReviews } from "@/lib/supabase/reviews";
import { isInWishlist } from "@/lib/supabase/wishlist";
import { transformProductToFull } from "@/lib/utils/products";
import { ProductPageParams } from "@/types/pages";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
  reviews,
  userId,
  averageRating,
  totalReviews,
}: {
  productId: string;
  reviews: Awaited<ReturnType<typeof getProductReviews>>;
  userId: string | undefined;
  averageRating: number;
  totalReviews: number;
}) {
  return (
    <div
      id="reviews"
      className="space-y-6 border-t border-accent-primary/30 pt-4 sm:pt-6 lg:pt-8 relative z-10"
    >
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

export default async function ProductDetailPage({ params }: ProductPageParams) {
  const { id } = await params;
  const [product, reviews, { data: { user } }] = await Promise.all([
    getProductById(id),
    getProductReviews(id),
    createClient().then((c) => c.auth.getUser()),
  ]);
  if (!product) notFound();
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  const totalReviews = reviews.length;
  const inWishlist =
    user?.id != null ? await isInWishlist(user.id, id) : false;

  return (
    <PageLayout padding="tight" contentClassName="py-4 sm:py-6 lg:py-12">
      <ProductMainContent
        product={product}
        averageRating={averageRating}
        totalReviews={totalReviews}
        isInWishlist={inWishlist}
      />
      <ReviewsContent
        productId={id}
        reviews={reviews}
        userId={user?.id}
        averageRating={averageRating}
        totalReviews={totalReviews}
      />
    </PageLayout>
  );
}
