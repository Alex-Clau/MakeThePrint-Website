"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { CartItemsListProps } from "@/types/cart-components";
import { getProductDisplayName } from "@/lib/utils/products";
import { messages } from "@/lib/messages";
import { getCartLineTotal, getCartUnitPrice } from "@/lib/cart/pricing";

export function CartItemsList({
  items,
  onUpdateQuantity,
  onRemove,
}: CartItemsListProps) {
  const t = messages.product;
  const c = messages.common;
  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map((item) => {
        const displayName = getProductDisplayName(item.products);
        const unitPrice = getCartUnitPrice(item);
        const lineTotal = getCartLineTotal(item);
        return (
        <Card key={item.id}>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative w-full sm:w-20 lg:w-24 h-32 sm:h-20 lg:h-24 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={item.products.images?.[0] || ""}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 80px, 96px"
                />
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {displayName}
                  </h3>
                  {item.customizations?.text != null && String(item.customizations.text).trim() !== "" && (
                    <p className="text-sm text-muted-foreground mb-1">
                      Text: &ldquo;{String(item.customizations.text)}&rdquo;
                    </p>
                  )}
                  {item.customizations?.size != null && (
                    <p className="text-xs text-muted-foreground mb-1">
                      Size: {String(item.customizations.size)}
                      {item.customizations.font != null && ` • Font: ${String(item.customizations.font)}`}
                      {item.customizations.color != null && ` • Color: ${String(item.customizations.color)}`}
                    </p>
                  )}
                  {((item.customizations?.isOutdoor === true) || (item.customizations?.isLedStrip === true) || (item.customizations?.isColor === true)) && (
                    <p className="text-xs text-muted-foreground mb-1">
                      Options: {[item.customizations.isOutdoor && "Outdoor", item.customizations.isLedStrip && "LED strip", item.customizations.isColor && "Color"].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {item.material && item.customizations?.text == null && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {t.feature} {item.material}
                    </p>
                  )}
                  <p className="text-lg font-bold">
                    {lineTotal.toFixed(2)}{" "}
                    {c.ron}
                    {item.quantity > 1 && (
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        ({unitPrice.toFixed(2)} {c.ron} × {item.quantity})
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 sm:h-9 sm:w-9 touch-manipulation"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium text-sm">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 sm:h-9 sm:w-9 touch-manipulation"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 sm:h-9 sm:w-9 text-destructive touch-manipulation"
                    onClick={() => onRemove(item.id, displayName)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        );
      })}
    </div>
  );
}

