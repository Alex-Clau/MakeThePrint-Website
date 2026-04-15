import { PageLayout } from "@/components/layout/page-layout";
import { messages } from "@/lib/messages";
import { FREE_SHIPPING_THRESHOLD_RON } from "@/lib/constants/shipping";

export default async function ShippingPage() {
  const s = messages.shipping;
  const romaniaDesc = s.romaniaDesc.replace(
    "{threshold}",
    String(FREE_SHIPPING_THRESHOLD_RON)
  );
  return (
    <PageLayout title={<h1 className="text-3xl font-bold">{s.title}</h1>} maxWidth="3xl" padding="relaxed">
      <div className="space-y-6 text-muted-foreground">
          <p>{s.intro}</p>
          <h2 className="font-semibold text-foreground">{s.romania}</h2>
          <p>{romaniaDesc}</p>
          <h2 className="font-semibold text-foreground">{s.international}</h2>
          <p>{s.internationalDesc}</p>
          <h2 className="font-semibold text-foreground">{s.tracking}</h2>
          <p>{s.trackingDesc}</p>
        </div>
    </PageLayout>
  );
}
