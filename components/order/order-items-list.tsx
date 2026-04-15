"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { OrderItemsListProps } from "@/types/order";
import { getProductDisplayName } from "@/lib/utils/products";
import { messages } from "@/lib/messages";

function lineImageSrc(images: string[] | undefined): string {
  const first = images?.find((u) => typeof u === "string" && u.trim() !== "");
  return first ?? "/package.png";
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  const t = messages.account;
  const c = messages.common;
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">{t.orderItems}</h2>
        <div className="space-y-4">
          {items.map((item) => {
            const rawName = getProductDisplayName(item.products);
            const displayName = rawName || t.productUnavailable;
            const showUnavailableStyle = item.products == null || !rawName;
            const src = lineImageSrc(item.products?.images ?? undefined);
            const opts = [
              item.customizations?.isOutdoor === true ? t.optionOutdoor : null,
              item.customizations?.isLedStrip === true ? t.optionLedStrip : null,
              item.customizations?.isColor === true ? t.optionColor : null,
            ].filter(Boolean);
            return (
              <div key={item.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-4 border-b last:border-0">
                <div className="relative w-full sm:w-20 h-32 sm:h-20 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={src}
                    alt={displayName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 80px"
                  />
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 min-w-0">
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-base sm:text-lg mb-1 line-clamp-2${
                        showUnavailableStyle ? " text-muted-foreground" : ""
                      }`}
                    >
                      {displayName}
                    </h3>
                    {item.customizations?.text != null && String(item.customizations.text).trim() !== "" && (
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                        {t.orderLineText}: &ldquo;{String(item.customizations.text)}&rdquo;
                      </p>
                    )}
                    {item.customizations?.size != null && (
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                        {t.orderLineSize}: {String(item.customizations.size)}
                        {item.customizations.font != null && ` • ${t.orderLineFont}: ${String(item.customizations.font)}`}
                        {item.customizations.color != null && ` • ${t.orderLineColor}: ${String(item.customizations.color)}`}
                      </p>
                    )}
                    {opts.length > 0 && (
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                        {t.orderLineOptions}: {opts.join(", ")}
                      </p>
                    )}
                    {item.material && item.customizations?.text == null && (
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                        {t.orderLineFeature}: {item.material}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {t.orderLineQuantity}: {item.quantity}
                    </p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="font-semibold text-base sm:text-lg">
                      {(item.price * item.quantity).toFixed(2)} {c.ron}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {item.price.toFixed(2)} {c.ron}
                        {t.orderLinePerUnit}
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

