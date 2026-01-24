import { Suspense } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedProductPageContent } from "@/components/product/animated-product-page-content";
import { ProductReviews } from "@/components/product/product-reviews";
import { getProductById } from "@/lib/supabase/products";
import { transformProductToFull } from "@/lib/utils/products";
import { ProductPageParams } from "@/types/pages";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function ProductContent({ productId }: { productId: string }) {
  const product = await getProductById(productId);
  if (!product) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const transformedProduct = transformProductToFull(product);
  return (
    <>
      <AnimatedProductPageContent product={transformedProduct} />
      <Suspense
        fallback={
          <div className="space-y-6 border-t pt-8 sm:pt-12">
            <div className="h-8 bg-muted animate-pulse rounded w-48" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        }
      >
        <ProductReviews productId={productId} userId={user?.id} />
      </Suspense>
    </>
  );
}

async function ProductPageContent({ params }: ProductPageParams) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-full" />
            <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
          </div>
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      }
    >
      <ProductContent productId={id} />
    </Suspense>
  );
}

export default function ProductDetailPage({ params }: ProductPageParams) {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-12">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              <div className="space-y-4">
                <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-4 bg-muted animate-pulse rounded w-full" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
              </div>
              <div className="h-96 bg-muted animate-pulse rounded-lg" />
            </div>
          }
        >
          <ProductPageContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}
