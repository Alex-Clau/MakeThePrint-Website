import { PageLayout } from "@/components/layout/page-layout";
import { ProductsGridSkeleton } from "@/components/skeletons/products-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionsLoading() {
  return (
    <PageLayout
      mainClassName="relative z-10 bg-background"
      title={
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-9 w-64" />
          </div>
          <Skeleton className="h-5 w-96 max-w-2xl" />
        </div>
      }
      padding="relaxed"
    >
      <ProductsGridSkeleton count={8} />
    </PageLayout>
  );
}
