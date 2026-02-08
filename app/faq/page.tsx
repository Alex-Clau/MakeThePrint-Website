import Link from "next/link";
import {Suspense} from "react";

export default function FAQPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">Loading...</div>}>
        <FAQContent />
      </Suspense>
    </main>
  );
}


async function FAQContent() {
  const { cookies } = await import("next/headers");
  const { getDictionary, getLocaleFromCookie } = await import("@/lib/i18n");
  const { Navigation } = await import("@/components/navigation");

  const locale = getLocaleFromCookie((await cookies()).get("locale")?.value);
  const t = getDictionary(locale);
  const f = t.faq;

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl font-bold mb-8">{f.title}</h1>
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
      </div>
    </main>
  );
}
