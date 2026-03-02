import { PageLayout } from "@/components/layout/page-layout";
import { messages } from "@/lib/messages";

export default async function PrivacyPage() {
  const p = messages.privacy;

  return (
    <PageLayout title={<h1 className="text-3xl font-bold">{p.title}</h1>} maxWidth="3xl" padding="relaxed">
      <div className="space-y-4 text-muted-foreground text-sm">
        <p>{p.lastUpdated}</p>
        <p>{p.body1}</p>
        <p>{p.body2}</p>
        <p>{p.body3}</p>
      </div>
    </PageLayout>
  );
}