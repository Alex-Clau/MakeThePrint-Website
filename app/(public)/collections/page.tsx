import { Suspense } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Sparkles } from "lucide-react";
import { fetchSeasonalProductCardsPage } from "@/lib/catalog/fetch-seasonal-product-cards-page";
import { messages } from "@/lib/messages";
import { ProductsGridSkeleton } from "@/components/skeletons/products-grid-skeleton";
import { CatalogSearchBar } from "@/components/shared/catalog-search-bar";
import { ProductsInfiniteList } from "@/components/product/products-infinite-list";

async function SeasonalCollections({
  search,
}: {
  search?: string;
}) {
  const pageSize = 8;
  const { products, hasMore } = await fetchSeasonalProductCardsPage({ page: 1, pageSize, search });
  const t = messages.seasons;

  return (
    <ProductsInfiniteList
      initialProducts={products}
      initialPage={1}
      pageSize={pageSize}
      initialHasMore={hasMore}
      search={search}
      apiPath="/api/products/seasonal"
      emptyLabel={t.noSeasonal}
      loadingLabel={t.loadingMore}
      endOfListLabel={t.endOfList}
      loadMoreFailedLabel={t.loadMoreFailed}
    />
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
        <SeasonalCollections search={search} />
      </Suspense>
    </PageLayout>
  );
}

