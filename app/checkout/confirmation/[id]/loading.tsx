import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderConfirmationLoading() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <Skeleton className="h-64 rounded-lg w-full" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
