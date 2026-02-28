import { Navigation } from "@/components/navigation";
import { CheckoutPageSkeleton } from "@/components/skeletons/checkout-page-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Skeleton className="h-9 w-40 mb-6 sm:mb-8" />
        <CheckoutPageSkeleton />
      </div>
    </main>
  );
}
