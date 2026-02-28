import { Skeleton } from "@/components/ui/skeleton";

export function AccountPageSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <Skeleton className="h-9 w-48 mb-6 sm:mb-8" />
      {/* Account menu cards: Orders, Wishlist, Addresses, Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border p-4 sm:p-6 space-y-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
              <div className="min-w-0 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Recent Orders card */}
      <div className="rounded-lg border p-6 space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
              <div className="flex items-center gap-4">
                <div className="space-y-1 text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                  <Skeleton className="h-3 w-14 ml-auto" />
                </div>
                <Skeleton className="h-9 w-14 rounded" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-full rounded" />
      </div>
    </div>
  );
}
