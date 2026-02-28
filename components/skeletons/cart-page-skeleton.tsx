import { Skeleton } from "@/components/ui/skeleton";

export function CartPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      <div className="lg:col-span-2 space-y-3 sm:space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Skeleton className="w-full sm:w-20 lg:w-24 h-32 sm:h-20 lg:h-24 rounded-lg flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center gap-2 mt-2">
                  <Skeleton className="h-9 w-24 rounded" />
                  <Skeleton className="h-9 w-9 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-1">
        <div className="rounded-lg border p-4 sm:p-6 space-y-4 sticky top-4">
          <Skeleton className="h-5 w-24" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="h-px w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-10 w-full rounded" />
        </div>
      </div>
    </div>
  );
}
