import { Suspense } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Sparkles, Gift } from "lucide-react";
import { getPublicSeasonalProducts } from "@/lib/supabase/products";
import { getProductReviewStats } from "@/lib/supabase/reviews";
import { getWishlistProductIds } from "@/lib/supabase/wishlist";
import { createClient } from "@/lib/supabase/server";
import { transformProductToCardData } from "@/lib/utils/products";
import { ProductCard } from "@/components/product/product-card";
import { messages } from "@/lib/messages";
import { ProductsGridSkeleton } from "@/components/skeletons/products-grid-skeleton";
import type { Messages } from "@/lib/messages";
import { CatalogSearchBar } from "@/components/shared/catalog-search-bar";

async function SeasonalCollections({
  messages,
  search,
}: {
  messages: Messages;
  search?: string;
}) {
  const [products, supabase] = await Promise.all([
    getPublicSeasonalProducts({ limit: 24, search }),
    createClient(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const wishlistIds = user ? await getWishlistProductIds(user.id) : new Set<string>();

  const reviewStats = await getProductReviewStats(products.map((p) => p.id));
  const transformedProducts = products.map((p) => {
    const stats = reviewStats.get(p.id);
    const card = transformProductToCardData({ ...p, rating: stats?.rating, review_count: stats?.review_count });
    return { ...card, isInWishlist: wishlistIds.has(p.id) };
  });
  const t = messages.seasons;

  return (
    <div className="space-y-8">
      {transformedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6">
          {transformedProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t.noSeasonal}</p>
        </div>
      )}
    </div>
  );
}

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const t = messages.seasons;
  const c = messages.common;

  return (
    <PageLayout
      mainClassName="relative z-10 bg-background"
      title={
        <div className="mb-8 sm:mb-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-start sm:gap-x-6 sm:gap-y-4">
            <div className="min-w-0 sm:col-span-8">
              <div className="mb-1.5 flex max-w-[56ch] flex-row items-center gap-2">
                <Sparkles
                  className="h-4 w-4 shrink-0 text-accent-primary-dark opacity-90 sm:h-[1.125rem] sm:w-[1.125rem]"
                  aria-hidden
                />
                <h1 className="text-balance text-xl font-bold tracking-tight text-accent-primary-dark sm:text-2xl lg:text-3xl">
                  {t.title}
                </h1>
              </div>
              <p className="max-w-[60ch] text-sm leading-relaxed text-foreground/80 sm:text-[0.9375rem]">
                {t.subhead}
              </p>
            </div>
            <div className="min-w-0 w-full sm:col-span-4 sm:flex sm:justify-end">
              <CatalogSearchBar
                placeholder={c.searchProductPlaceholder}
                clearLabel={c.clearSearch}
                loadingLabel={c.loading}
                className="w-full max-w-none sm:max-w-[340px] sm:shrink-0"
              />
            </div>
          </div>
        </div>
      }
      padding="relaxed"
    >
      <Suspense fallback={<ProductsGridSkeleton count={8} />}>
        <SeasonalCollections messages={messages} search={search} />
      </Suspense>
    </PageLayout>
  );
}

