import Link from "next/link";
import { PageLayout } from "@/components/layout/page-layout";
import { messages } from "@/lib/messages";

export default async function FAQPage() {
  const f = messages.faq;

  return (
    <PageLayout title={<h1 className="text-3xl font-bold">{f.title}</h1>} maxWidth="3xl" padding="relaxed">
      <dl className="space-y-6">
          <div>
            <dt className="font-semibold text-lg">{f.q1}</dt>
            <dd className="text-muted-foreground mt-1">{f.a1}</dd>
          </div>
          <div>
            <dt className="font-semibold text-lg">{f.q2}</dt>
            <dd className="text-muted-foreground mt-1">{f.a2}</dd>
          </div>
          <div>
            <dt className="font-semibold text-lg">{f.q3}</dt>
            <dd className="text-muted-foreground mt-1">{f.a3}</dd>
          </div>
          <div>
            <dt className="font-semibold text-lg">{f.q4}</dt>
            <dd className="text-muted-foreground mt-1">
              {f.a4} <Link href="/refunds" className="text-accent-primary-dark underline">{f.refundsLink}</Link>.
            </dd>
          </div>
        </dl>
    </PageLayout>
  );
}
