import { PageLayout } from "@/components/layout/page-layout";
import { messages } from "@/lib/messages";

export default async function RefundsPage() {
  const r = messages.refunds;
  return (
    <PageLayout title={<h1 className="text-3xl font-bold">{r.title}</h1>} maxWidth="3xl" padding="relaxed">
      <div className="space-y-4 text-muted-foreground text-sm">
        <p>{r.body1}</p>
        <p>{r.body2}</p>
        <p>{r.body3}</p>
      </div>
    </PageLayout>
  );
}
