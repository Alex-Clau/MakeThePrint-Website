import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderConfirmationLoading() {
  return (
    <PageLayout padding="relaxed">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <Skeleton className="h-64 rounded-lg w-full" />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
