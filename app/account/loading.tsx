import { PageLayout } from "@/components/layout/page-layout";
import { AccountPageSkeleton } from "@/components/skeletons/account-page-skeleton";

export default function AccountLoading() {
  return (
    <PageLayout>
      <AccountPageSkeleton />
    </PageLayout>
  );
}
