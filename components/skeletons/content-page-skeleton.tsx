import { Skeleton } from "@/components/ui/skeleton";

const ContentSkeletonInner = () => (
  <>
    <Skeleton className="h-9 w-48" />
    <dl className="space-y-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-1">
          <Skeleton className="h-6 w-full max-w-md" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
        </div>
      ))}
    </dl>
  </>
);

export function ContentPageSkeleton({ noWrapper }: { noWrapper?: boolean } = {}) {
  if (noWrapper) {
    return (
      <div className="space-y-8">
        <ContentSkeletonInner />
      </div>
    );
  }
  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <ContentSkeletonInner />
    </div>
  );
}
