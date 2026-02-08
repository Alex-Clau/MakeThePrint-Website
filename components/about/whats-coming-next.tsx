"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/components/locale-provider";

export function WhatsComingNext() {
  const t = useTranslations().about;
  return (
    <section className="mb-8">
      <Card>
        <CardContent className="p-6 sm:p-8 lg:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            {t.whatsComingTitle}
          </h2>
          <p className="text-muted-foreground mb-6">{t.whatsComingIntro}</p>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">{t.newProductTypes}</h3>
              <p className="text-sm text-muted-foreground">{t.newProductTypesDesc}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{t.fasterTurnaround}</h3>
              <p className="text-sm text-muted-foreground">{t.fasterTurnaroundDesc}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{t.adventSpecials}</h3>
              <p className="text-sm text-muted-foreground">{t.adventSpecialsDesc}</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-6">{t.whatsComingThankYou}</p>
        </CardContent>
      </Card>
    </section>
  );
}

