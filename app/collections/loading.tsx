import { Navigation } from "@/components/navigation";
import { ProductsGridSkeleton } from "@/components/skeletons/products-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionsLoading() {
  return (
    <main className="min-h-screen flex flex-col relative z-10 bg-background">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-9 w-64" />
          </div>
          <Skeleton className="h-5 w-96 max-w-2xl" />
        </div>
        <ProductsGridSkeleton count={8} />
      </div>
    </main>
  );
}
