"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Home, Search } from "lucide-react";
import { useTranslations } from "@/components/locale-provider";

export default function NotFound() {
  const t = useTranslations().notFound;
  const c = useTranslations().common;
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl sm:text-8xl font-bold mb-4">404</h1>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">{t.title}</h2>
          <p className="text-muted-foreground mb-8">{t.description}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                {c.goHome}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/products">
                <Search className="mr-2 h-4 w-4" />
                {c.browseProducts}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

