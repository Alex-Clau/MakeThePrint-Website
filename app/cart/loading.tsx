import { Navigation } from "@/components/navigation";
import { CartPageSkeleton } from "@/components/skeletons/cart-page-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Skeleton className="h-9 w-64 mb-4 sm:mb-6 lg:mb-8" />
        <CartPageSkeleton />
      </div>
    </main>
  );
}
