import { Skeleton } from "@/components/ui/skeleton";
import { Navigation } from "@/components/navigation";

export function ProductDetailSkeleton() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-12">
        <div className="space-y-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start lg:items-center">
            {/* Left: image gallery */}
            <Skeleton className="aspect-square w-full max-w-lg rounded-lg" />
            {/* Right: product info / form */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-32 mt-4" />
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-12 w-full rounded mt-4" />
                <Skeleton className="h-11 w-full rounded" />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6 border-t border-accent-primary/30 pt-4 sm:pt-6 lg:pt-8 mt-8 relative z-10">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
