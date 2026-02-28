import { Navigation } from "@/components/navigation";
import { AccountPageSkeleton } from "@/components/skeletons/account-page-skeleton";

export default function AccountLoading() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AccountPageSkeleton />
      </div>
    </main>
  );
}
