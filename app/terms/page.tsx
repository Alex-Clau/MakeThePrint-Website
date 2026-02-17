import { cookies } from "next/headers";
import { Navigation } from "@/components/navigation";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";

export default async function TermsPage() {
  const locale = getLocaleFromCookie((await cookies()).get("locale")?.value);
  const t = getDictionary(locale);
  const p = t.terms;
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl font-bold mb-8">{p.title}</h1>
        <div className="space-y-4 text-muted-foreground text-sm">
          <p>{p.lastUpdated}</p>
          <p>{p.body1}</p>
          <p>{p.body2}</p>
          <p>{p.body3}</p>
        </div>
        {(t.footer.legalName || t.footer.tradeRegistry || t.footer.fiscalCode || t.footer.registeredAddress) && (
          <div className="mt-10 pt-8 border-t border-accent-primary/30">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t.footer.companyDetails}</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-muted-foreground">
              {t.footer.legalName ? (
                <div>
                  <dt className="font-medium text-foreground/80">{t.footer.legalNameLabel}</dt>
                  <dd>{t.footer.legalName}</dd>
                </div>
              ) : null}
              {t.footer.tradeRegistry ? (
                <div>
                  <dt className="font-medium text-foreground/80">{t.footer.tradeRegistryLabel}</dt>
                  <dd>{t.footer.tradeRegistry}</dd>
                </div>
              ) : null}
              {t.footer.fiscalCode ? (
                <div>
                  <dt className="font-medium text-foreground/80">{t.footer.fiscalCodeLabel}</dt>
                  <dd>{t.footer.fiscalCode}</dd>
                </div>
              ) : null}
              {t.footer.registeredAddress ? (
                <div>
                  <dt className="font-medium text-foreground/80">{t.footer.registeredAddressLabel}</dt>
                  <dd>{t.footer.registeredAddress}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        )}
      </div>
    </main>
  );
}
