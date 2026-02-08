"use client";

import { useLocale } from "@/components/locale-provider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const COOKIE_NAME = "locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function LanguageSwitcher() {
  const { locale } = useLocale();
  const router = useRouter();

  function switchTo(newLocale: "en" | "ro") {
    document.cookie = `${COOKIE_NAME}=${newLocale};path=/;max-age=${COOKIE_MAX_AGE}`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={locale === "en" ? "secondary" : "ghost"}
        size="sm"
        className="h-8 px-2 text-xs font-medium"
        onClick={() => switchTo("en")}
      >
        EN
      </Button>
      <Button
        variant={locale === "ro" ? "secondary" : "ghost"}
        size="sm"
        className="h-8 px-2 text-xs font-medium"
        onClick={() => switchTo("ro")}
      >
        RO
      </Button>
    </div>
  );
}
