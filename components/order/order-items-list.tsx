"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { OrderItemsListProps } from "@/types/order";
import { getProductDisplayName } from "@/lib/utils/products";
import { useLocale, useTranslations } from "@/components/locale-provider";

export function OrderItemsList({ items }: OrderItemsListProps) {
  const { locale } = useLocale();
  const t = useTranslations().account;
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">{t.orderItems}</h2>
        <div className="space-y-4">
          {items.map((item) => {
            const displayName = getProductDisplayName(item.products, locale);
            return (
              <div key={item.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-4 border-b last:border-0">
                <div className="relative w-full sm:w-20 h-32 sm:h-20 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src="/package.png"
                    alt={displayName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 80px"
                  />
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 min-w-0">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-2">
                      {displayName}
                    </h3>
                    {item.customizations?.text != null && String(item.customizations.text).trim() !== "" && (
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Text: &ldquo;{String(item.customizations.text)}&rdquo;
                      </p>
                    )}
                    {item.customizations?.size != null && (
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Size: {String(item.customizations.size)}
                        {item.customizations.font != null && ` • Font: ${String(item.customizations.font)}`}
                        {item.customizations.color != null && ` • Color: ${String(item.customizations.color)}`}
                      </p>
                    )}
                    {((item.customizations?.isOutdoor === true) || (item.customizations?.isLedStrip === true) || (item.customizations?.isColor === true)) && (
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Options: {[item.customizations.isOutdoor && "Outdoor", item.customizations.isLedStrip && "LED strip", item.customizations.isColor && "Color"].filter(Boolean).join(", ")}
                      </p>
                    )}
                    {item.material && item.customizations?.text == null && (
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Feature: {item.material}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="font-semibold text-base sm:text-lg">
                      {(item.price * item.quantity).toFixed(2)} RON
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {item.price.toFixed(2)} RON each
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

