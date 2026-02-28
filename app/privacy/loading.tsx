import { Navigation } from "@/components/navigation";
import { ContentPageSkeleton } from "@/components/skeletons/content-page-skeleton";

export default function PrivacyLoading() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <ContentPageSkeleton />
    </main>
  );
}
