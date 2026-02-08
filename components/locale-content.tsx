import { Suspense } from "react";
import { ToastProvider } from "@/components/providers/toast-provider";
import { Footer } from "@/components/footer/footer";
import { LocaleProvider } from "@/components/locale-provider";
import { LocaleHtmlLang } from "@/components/locale-html-lang";

export function LocaleContent({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex flex-col">Loading...</div>}>
      <AsyncLocaleContent>{children}</AsyncLocaleContent>
    </Suspense>
  );
}

async function AsyncLocaleContent({ children }: { children: React.ReactNode }) {
  const { cookies } = await import("next/headers");
  const { getDictionary, getLocaleFromCookie } = await import("@/lib/i18n");

  const cookieStore = await cookies();
  const locale = getLocaleFromCookie(cookieStore.get("locale")?.value);
  const messages = getDictionary(locale);

  return (
    <LocaleProvider locale={locale} messages={messages}>
      <LocaleHtmlLang />
      <ToastProvider />
      <div className="min-h-screen flex flex-col">
        <Suspense fallback={<PageLoadingFallback />}>
          {children}
        </Suspense>
        <Footer messages={messages} />
      </div>
    </LocaleProvider>
  );
}

function PageLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
      <div className="animate-pulse text-muted-foreground text-sm">Loading…</div>
    </div>
  );
}