"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Navigation } from "@/components/navigation";
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
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full space-y-6">
          <Alert variant="destructive" className="text-left">
            <AlertCircle className="size-4" />
            <AlertTitle>{t.title}</AlertTitle>
            <AlertDescription>{t.description}</AlertDescription>
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
      </div>
    </main>
  );
}

