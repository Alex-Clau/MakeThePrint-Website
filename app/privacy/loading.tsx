import { PageLayout } from "@/components/layout/page-layout";
import { ContentPageSkeleton } from "@/components/skeletons/content-page-skeleton";

export default function PrivacyLoading() {
  return (
    <PageLayout maxWidth="3xl" padding="relaxed">
      <ContentPageSkeleton noWrapper />
    </PageLayout>
  );
}
