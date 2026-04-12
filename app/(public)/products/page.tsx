import { Suspense } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { ProductsInfiniteList } from "@/components/product/products-infinite-list";
import { ProductsGridSkeleton } from "@/components/skeletons/products-grid-skeleton";
import { fetchCustomProductCardsPage } from "@/lib/catalog/fetch-custom-product-cards-page";
import { messages } from "@/lib/messages";

async function ProductsList() {
  const pageSize = 8;
  const { products: transformedProducts, hasMore } =
    await fetchCustomProductCardsPage({ page: 1, pageSize });
  return (
    <ProductsInfiniteList
      initialProducts={transformedProducts}
      initialPage={1}
      pageSize={pageSize}
      initialHasMore={hasMore}
    />
  );
}

export default async function ProductsPage() {
  const t = messages.products;

  return (
    <PageLayout
      titleClassName="mb-0"
      title={
        <div className="mb-6 sm:mb-8 border-b border-accent-primary/30 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-accent-primary-dark">
                {t.title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t.subhead}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <Suspense fallback={<ProductsGridSkeleton count={8} />}>
        <ProductsList />
      </Suspense>
    </PageLayout>
  );
}

