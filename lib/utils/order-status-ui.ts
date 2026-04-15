import { messages } from "@/lib/messages";

/**
 * Status pill for order lists and headers: visible border + fill so it reads in light and dark UI.
 */
export function orderStatusBadgeClassName(status: string): string {
  const key = status.toLowerCase();
  const map: Record<string, string> = {
    pending:
      "rounded-s border border-primary/35 bg-primary/10 text-primary shadow-sm dark:border-primary/50 dark:bg-primary/20 dark:text-primary",
    confirmed:
      "rounded-s border border-primary/45 bg-primary/18 text-primary shadow-sm dark:border-primary/55 dark:bg-primary/30 dark:text-primary",
    shipped:
      "rounded-s border border-primary/50 bg-primary/25 text-primary shadow-sm dark:border-primary/60 dark:bg-primary/38 dark:text-primary",
    delivered:
      "rounded-s border border-primary/70 bg-primary text-primary-foreground shadow-sm dark:border-primary dark:bg-primary dark:text-primary-foreground",
    failed:
      "rounded-s border border-muted-foreground/30 bg-muted text-muted-foreground shadow-sm",
    cancelled:
      "rounded-s border border-muted-foreground/30 bg-muted text-muted-foreground shadow-sm",
    canceled:
      "rounded-s border border-muted-foreground/30 bg-muted text-muted-foreground shadow-sm",
  };
  const neutral =
    "rounded-s border border-border bg-muted/40 text-muted-foreground shadow-sm";
  return map[key] ?? neutral;
}

export function orderStatusLabelRo(status: string): string {
  const table = messages.account.orderStatusLabels;
  const k = status.toLowerCase();
  if (k in table) {
    return table[k as keyof typeof table];
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
}
