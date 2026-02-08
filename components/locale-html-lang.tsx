"use client";

import { useEffect } from "react";
import { useLocale } from "@/components/locale-provider";

/**
 * Syncs document.documentElement.lang with the current locale.
 * Use once inside LocaleProvider so the html lang is correct after async locale loads.
 */
export function LocaleHtmlLang() {
  const { locale } = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
