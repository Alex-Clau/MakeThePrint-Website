"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      duration={2000}
      toastOptions={{
        className: "!text-sm !px-3 !py-2 !max-w-[90vw] sm:!max-w-md",
        style: {
          fontSize: "0.875rem",
          padding: "0.5rem 0.75rem",
        },
      }}
      closeButton={false}
    />
  );
}

