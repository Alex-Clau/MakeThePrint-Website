"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package, Heart, Zap, TrendingUp } from "lucide-react";
import { useTranslations } from "@/components/locale-provider";

export function WhyWorkWithUs() {
  const t = useTranslations().about;
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        {t.whyTitle}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <Package className="h-10 w-10 mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">{t.qualityPrints}</h3>
            <p className="text-sm text-muted-foreground">{t.qualityPrintsDesc}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Heart className="h-10 w-10 mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">{t.madeWithCare}</h3>
            <p className="text-sm text-muted-foreground">{t.madeWithCareDesc}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Zap className="h-10 w-10 mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">{t.customWelcome}</h3>
            <p className="text-sm text-muted-foreground">{t.customWelcomeDesc}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <TrendingUp className="h-10 w-10 mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">{t.growingEveryDay}</h3>
            <p className="text-sm text-muted-foreground">{t.growingEveryDayDesc}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

