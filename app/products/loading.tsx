import { PageLayout } from "@/components/layout/page-layout";
import { ProductsGridSkeleton } from "@/components/skeletons/products-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <PageLayout
      titleClassName="mb-0"
      title={
        <div className="mb-6 sm:mb-8 border-b border-accent-primary/30 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="space-y-2">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-5 w-72" />
            </div>
          </div>
        </div>
      }
    >
      <ProductsGridSkeleton count={8} />
    </PageLayout>
  );
}
