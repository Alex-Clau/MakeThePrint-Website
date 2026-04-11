"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppFallbackShell } from "@/components/layout/app-fallback-shell";
import { AlertCircle, Home } from "lucide-react";
import { messages } from "@/lib/messages";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = messages.error;
  const c = messages.common;

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <AppFallbackShell>
      <div className="text-center max-w-md w-full space-y-6">
        <Alert variant="destructive" className="text-left">
          <AlertCircle className="size-4" />
          <AlertTitle>{t.title}</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{t.description}</p>
            {error.digest != null && error.digest !== "" && (
              <p className="text-xs font-mono opacity-90">
                {t.digestLabel}: {error.digest}
              </p>
            )}
          </AlertDescription>
        </Alert>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} size="lg">
            {c.tryAgain}
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {c.goHome}
            </Link>
          </Button>
        </div>
      </div>
    </AppFallbackShell>
  );
}

