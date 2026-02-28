import { Navigation } from "@/components/navigation";
import { messages } from "@/lib/messages";

export default async function ShippingPage() {
  const s = messages.shipping;
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl font-bold mb-8">{s.title}</h1>
        <div className="space-y-6 text-muted-foreground">
          <p>{s.intro}</p>
          <h2 className="font-semibold text-foreground">{s.romania}</h2>
          <p>{s.romaniaDesc}</p>
          <h2 className="font-semibold text-foreground">{s.international}</h2>
          <p>{s.internationalDesc}</p>
          <h2 className="font-semibold text-foreground">{s.tracking}</h2>
          <p>{s.trackingDesc}</p>
        </div>
      </div>
    </main>
  );
}
