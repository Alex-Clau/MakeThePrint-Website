import { Navigation } from "@/components/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        <Skeleton className="h-9 w-48 mb-6" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </main>
  );
}
