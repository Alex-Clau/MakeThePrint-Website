"use client";

import Image from "next/image";
import { OrderItemProps } from "@/types/checkout";
import { getProductDisplayName } from "@/lib/utils/products";
import { useLocale } from "@/components/locale-provider";

export function OrderItem({ item }: OrderItemProps) {
  const { locale } = useLocale();
  const product = item.products;
  const displayName = product
    ? getProductDisplayName(product, locale)
    : "Product";
  const imageUrl =
    product?.images && product.images.length > 0
      ? product.images[0]
      : "https://via.placeholder.com/64";
  const lineTotal =
    item.customizations?.totalPrice != null
      ? item.customizations.totalPrice
      : (product?.price || 0) * item.quantity;

  return (
    <div className="flex gap-3">
      <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
        <Image
          src={imageUrl}
          alt={displayName}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">
          {displayName}
        </p>
        {item.customizations?.text != null && String(item.customizations.text).trim() !== "" && (
          <p className="text-xs text-muted-foreground">Text: &ldquo;{String(item.customizations.text)}&rdquo;</p>
        )}
        {item.customizations?.size != null && (
          <p className="text-xs text-muted-foreground">
            Size: {String(item.customizations.size)}
            {item.customizations.font != null && ` • Font: ${String(item.customizations.font)}`}
            {item.customizations.color != null && ` • Color: ${String(item.customizations.color)}`}
          </p>
        )}
        {((item.customizations?.isOutdoor === true) || (item.customizations?.isLedStrip === true) || (item.customizations?.isColor === true)) && (
          <p className="text-xs text-muted-foreground">
            Options: {[item.customizations.isOutdoor && "Outdoor", item.customizations.isLedStrip && "LED strip", item.customizations.isColor && "Color"].filter(Boolean).join(", ")}
          </p>
        )}
        {item.material && item.customizations?.text == null && (
          <p className="text-xs text-muted-foreground">Feature: {item.material}</p>
        )}
        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
        <p className="text-sm font-semibold">
          {lineTotal.toFixed(2)} RON
        </p>
      </div>
    </div>
  );
}

