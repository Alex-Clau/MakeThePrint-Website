import { FooterAccountLinks } from "./footer-account-links";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import Link from "next/link";
import Image from "next/image";
import type { Messages } from "@/lib/i18n";

export function Footer({ messages }: { messages: Messages }) {
  const f = messages.footer;
  return (
    <footer className="w-full border-t border-accent-primary/30 mt-6 sm:mt-16 lg:mt-24 bg-accent-primary-light/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-accent-primary-dark">{f.brand}</h3>
            <p className="text-sm text-muted-foreground">{f.tagline}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{f.shop}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-accent-primary-dark transition-colors">
                  {f.allProducts}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent-primary-dark transition-colors">
                  {f.aboutUs}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{f.support}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/faq" className="hover:text-accent-primary-dark transition-colors">
                  {f.faq}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-accent-primary-dark transition-colors">
                  {f.shipping}
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="hover:text-accent-primary-dark transition-colors">
                  {f.refunds}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{f.legal}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-accent-primary-dark transition-colors">
                  {f.terms}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent-primary-dark transition-colors">
                  {f.privacy}
                </Link>
              </li>
              <li>
                <Link href="https://anpc.ro" className="hover:text-accent-primary-dark transition-colors">
                  {f.anpc}
                </Link>
              </li>
            </ul>
          </div>
          <FooterAccountLinks />
        </div>
        {(f.legalName || f.tradeRegistry || f.fiscalCode || f.registeredAddress) && (
          <div className="mb-6 sm:mb-8 pt-6 sm:pt-8 border-t border-accent-primary/30">
            <h4 className="text-sm font-semibold text-accent-primary-dark mb-3">{f.companyDetails}</h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-xs text-muted-foreground">
              {f.legalName ? (
                <div>
                  <dt className="font-medium text-foreground/80">{f.legalNameLabel}</dt>
                  <dd>{f.legalName}</dd>
                </div>
              ) : null}
              {f.tradeRegistry ? (
                <div>
                  <dt className="font-medium text-foreground/80">{f.tradeRegistryLabel}</dt>
                  <dd>{f.tradeRegistry}</dd>
                </div>
              ) : null}
              {f.fiscalCode ? (
                <div>
                  <dt className="font-medium text-foreground/80">{f.fiscalCodeLabel}</dt>
                  <dd>{f.fiscalCode}</dd>
                </div>
              ) : null}
              {f.registeredAddress ? (
                <div>
                  <dt className="font-medium text-foreground/80">{f.registeredAddressLabel}</dt>
                  <dd className="max-w-xs">{f.registeredAddress}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-3 sm:pt-4 border-t border-accent-primary/30">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <p className="text-xs text-muted-foreground text-center sm:text-left">{f.copyright}</p>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </div>
          <div className="flex flex-row items-center justify-center sm:justify-end gap-3 flex-wrap">
            <a
              href="https://consumer-redress.ec.europa.eu/site-relocation_en?event=main.home2.show&lng=RO"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded shrink-0"
              aria-label="Soluționarea online a litigiilor - ANPC"
            >
              <Image
                src="/anpc-sol.png"
                alt="Soluționarea online a litigiilor"
                width={200}
                height={80}
                className="h-14 w-auto object-contain sm:h-16"
              />
            </a>
            <a
              href="https://anpc.ro/ce-este-sal/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded shrink-0"
              aria-label="Soluționarea alternativă a litigiilor - ANPC"
            >
              <Image
                src="/anpc-sal.png"
                alt="Soluționarea alternativă a litigiilor - ANPC"
                width={240}
                height={80}
                className="h-14 w-auto object-contain sm:h-16"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

