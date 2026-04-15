"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

/**
 * Sonner’s built-in `theme="system"` follows **prefers-color-scheme**, not `next-themes`
 * (`class` on `<html>`). That mismatch is the usual reason toasts look “wrong” in dark mode.
 */
export function ToastProvider() {
  const { resolvedTheme } = useTheme();

  const sonnerTheme =
    resolvedTheme === "dark"
      ? "dark"
      : resolvedTheme === "light"
        ? "light"
        : "system";

  return (
    <Toaster
      theme={sonnerTheme}
      position="top-center"
      richColors
      expand={false}
      visibleToasts={3}
      duration={3000}
      gap={6}
      closeButton={false}
      offset={{
        top: "max(0.75rem, calc(0.35rem + env(safe-area-inset-top, 0px)))",
        left: "max(0.75rem, env(safe-area-inset-left, 0px))",
        right: "max(0.75rem, env(safe-area-inset-right, 0px))",
      }}
      mobileOffset={{
        top: "max(0.625rem, calc(0.25rem + env(safe-area-inset-top, 0px)))",
        left: "max(0.625rem, env(safe-area-inset-left, 0px))",
        right: "max(0.625rem, env(safe-area-inset-right, 0px))",
      }}
      toastOptions={{
        classNames: {
          toast:
            "!min-h-0 !w-full !gap-2.5 !rounded-xl !border !border-border/70 !bg-card/95 !px-3.5 !py-2.5 !text-left !text-card-foreground !shadow-lg !backdrop-blur supports-[backdrop-filter]:!bg-card/85 !max-w-[min(20rem,calc(100vw-1.25rem))] sm:!px-4 sm:!py-3 sm:!max-w-[min(22rem,calc(100vw-2rem))]",
          title: "!text-[0.8125rem] !font-semibold !leading-snug sm:!text-sm",
          description: "!mt-0.5 !text-xs !leading-relaxed !text-muted-foreground sm:!text-[0.8125rem]",
          icon: "!text-foreground/90",
        },
      }}
    />
  );
}
