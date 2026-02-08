import en from "@/messages/en.json";
import ro from "@/messages/ro.json";

export type Locale = "en" | "ro";
export type Messages = typeof en;

export function getDictionary(locale: string): Messages {
  return locale === "ro" ? (ro as Messages) : en;
}

export function getLocaleFromCookie(cookieValue: string | undefined): Locale {
  return cookieValue === "ro" ? "ro" : "en";
}
