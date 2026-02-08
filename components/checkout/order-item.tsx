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
  const itemPrice = product?.price || 0;

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
        {item.material && (
          <p className="text-xs text-muted-foreground">Feature: {item.material}</p>
        )}
        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
        <p className="text-sm font-semibold">
          {(itemPrice * item.quantity).toFixed(2)} RON
        </p>
      </div>
    </div>
  );
}

