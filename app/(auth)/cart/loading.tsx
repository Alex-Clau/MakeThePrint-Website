import { PageLayout } from "@/components/layout/page-layout";
import { CartPageSkeleton } from "@/components/skeletons/cart-page-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <PageLayout title={<Skeleton className="h-9 w-64" />} padding="tight" titleClassName="mb-4 sm:mb-6 lg:mb-8">
      <CartPageSkeleton />
    </PageLayout>
  );
}
