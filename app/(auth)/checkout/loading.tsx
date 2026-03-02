import { PageLayout } from "@/components/layout/page-layout";
import { CheckoutPageSkeleton } from "@/components/skeletons/checkout-page-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <PageLayout title={<Skeleton className="h-9 w-40" />}>
      <CheckoutPageSkeleton />
    </PageLayout>
  );
}
