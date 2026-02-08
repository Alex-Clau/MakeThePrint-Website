import { ToastProvider } from "@/components/providers/toast-provider";
import { Footer } from "@/components/footer/footer";
import { LocaleProvider } from "@/components/locale-provider";
import { LocaleHtmlLang } from "@/components/locale-html-lang";
import { getDictionary } from "@/lib/i18n";

const defaultMessages = getDictionary("en");

/**
 * Static loading shell — no route children. Used as Suspense fallback so we never
 * run the page (and its cookies()) until LocaleContent has resolved.
 */
export function LocaleFallback() {
  return (
    <LocaleProvider locale="en" messages={defaultMessages}>
      <LocaleHtmlLang />
      <ToastProvider />
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-muted-foreground text-sm">{defaultMessages.common.loading}</div>
        </div>
        <Footer messages={defaultMessages} />
      </div>
    </LocaleProvider>
  );
}
