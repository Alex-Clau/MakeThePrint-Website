"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      offset={{ top: "0.75rem", right: "0.75rem" }}
      mobileOffset={{ top: "0.75rem", right: "0.75rem" }}
      duration={2800}
      gap={10}
      toastOptions={{
        className:
          "!text-sm !leading-snug !px-4 !py-3 !min-h-0 !max-w-[min(22rem,calc(100vw-1.5rem))] sm:!text-[0.9375rem]",
      }}
      closeButton={false}
    />
  );
}

