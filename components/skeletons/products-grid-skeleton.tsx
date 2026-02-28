import { Skeleton } from "@/components/ui/skeleton";

interface ProductsGridSkeletonProps {
  count?: number;
}

export function ProductsGridSkeleton({ count = 4 }: ProductsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className="aspect-[4/3] sm:aspect-square rounded-lg" />
      ))}
    </div>
  );
}
