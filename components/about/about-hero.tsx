"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "@/components/locale-provider";

export function AboutHero() {
  const t = useTranslations().about;
  return (
    <div className="text-center mb-12 sm:mb-16">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
        {t.heroWelcome}
      </h1>
      <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2">
        {t.heroName}
      </p>
      <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        {t.heroIntro}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/products">{t.exploreProducts}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="#story">{t.ourStory}</Link>
        </Button>
      </div>
    </div>
  );
}

