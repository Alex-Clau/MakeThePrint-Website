import { Navigation } from "@/components/navigation";
import { AnimatedProductPageContent } from "@/components/product/animated-product-page-content";
import { ProductReviewsList } from "@/components/product/product-reviews-list";
import { getProductById } from "@/lib/supabase/products";
import { getProductReviews } from "@/lib/supabase/reviews";
import { transformProductToFull } from "@/lib/utils/products";
import { ProductPageParams } from "@/types/pages";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function ProductMainContent({ productId }: { productId: string }) {
  const product = await getProductById(productId);
  if (!product) notFound();
  const transformedProduct = transformProductToFull(product);
  return <AnimatedProductPageContent product={transformedProduct} />;
}

async function ReviewsContent({ productId }: { productId: string }) {
  const [reviews, { data: { user } }] = await Promise.all([
    getProductReviews(productId),
    createClient().then((c) => c.auth.getUser()),
  ]);
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  const totalReviews = reviews.length;
  return (
    <div className="space-y-6 border-t border-accent-primary/30 pt-4 sm:pt-6 lg:pt-8 relative z-10">
      <ProductReviewsList
        reviews={reviews}
        currentUserId={user?.id}
        averageRating={averageRating}
        totalReviews={totalReviews}
        productId={productId}
      />
    </div>
  );
}

export default async function ProductDetailPage({ params }: ProductPageParams) {
  const { id } = await params;
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-12">
        <ProductMainContent productId={id} />
        <ReviewsContent productId={id} />
      </div>
    </main>
  );
}
