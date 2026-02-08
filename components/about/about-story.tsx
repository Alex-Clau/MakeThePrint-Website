"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/components/locale-provider";

export function AboutStory() {
  const t = useTranslations().about;
  return (
    <section id="story" className="mb-12 sm:mb-16">
      <Card>
        <CardContent className="p-6 sm:p-8 lg:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">{t.storyTitle}</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>{t.storyP1}</p>
            <p>{t.storyP2}</p>
            <p>{t.storyP3}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

