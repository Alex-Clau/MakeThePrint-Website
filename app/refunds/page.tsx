import { cookies } from "next/headers";
import { Navigation } from "@/components/navigation";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";

export default async function RefundsPage() {
  const locale = getLocaleFromCookie((await cookies()).get("locale")?.value);
  const t = getDictionary(locale);
  const r = t.refunds;
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl font-bold mb-8">{r.title}</h1>
        <div className="space-y-4 text-muted-foreground text-sm">
          <p>{r.body1}</p>
          <p>{r.body2}</p>
          <p>{r.body3}</p>
        </div>
      </div>
    </main>
  );
}
