import { Suspense } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { ProductsInfiniteList } from "@/components/product/products-infinite-list";
import { ProductsGridSkeleton } from "@/components/skeletons/products-grid-skeleton";
import { fetchCustomProductCardsPage } from "@/lib/catalog/fetch-custom-product-cards-page";
import { messages } from "@/lib/messages";
import { CatalogSearchBar } from "@/components/shared/catalog-search-bar";

async function ProductsList({ search }: { search?: string }) {
  const pageSize = 8;
  const { products: transformedProducts, hasMore } =
    await fetchCustomProductCardsPage({ page: 1, pageSize, search });
  return (
    <ProductsInfiniteList
      initialProducts={transformedProducts}
      initialPage={1}
      pageSize={pageSize}
      initialHasMore={hasMore}
      search={search}
    />
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const t = messages.products;
  const c = messages.common;

  return (
    <PageLayout
      titleClassName="mb-0"
      title={
        <div className="mb-6 sm:mb-8 border-b border-accent-primary/30 pb-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-start sm:gap-x-6 sm:gap-y-4">
            <div className="min-w-0 sm:col-span-8">
              <h1 className="mb-1.5 max-w-[56ch] text-xl font-bold tracking-tight text-accent-primary-dark sm:text-2xl lg:text-3xl">
                {t.title}
              </h1>
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
    >
      <Suspense fallback={<ProductsGridSkeleton count={8} />}>
        <ProductsList search={search} />
      </Suspense>
    </PageLayout>
  );
}

