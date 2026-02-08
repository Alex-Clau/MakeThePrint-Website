"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lock } from "lucide-react";
import { OrderSummaryProps } from "@/types/checkout";
import { OrderItem } from "./order-item";
import { useTranslations } from "@/components/locale-provider";

export function OrderSummary({
  cartItems,
  subtotal,
  shipping,
  tax,
  total,
}: OrderSummaryProps) {
  const cartT = useTranslations().cart;
  const checkoutT = useTranslations().checkout;
  const c = useTranslations().common;
  return (
    <Card className="lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">{checkoutT.orderSummary}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {cartItems.map((item) => (
            <OrderItem key={item.id} item={item} />
          ))}
        </div>
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{cartT.subtotal}</span>
            <span>{subtotal.toFixed(2)} {c.ron}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{cartT.shipping}</span>
            <span>
              {shipping === 0 ? (
                <span className="text-green-600">{cartT.free}</span>
              ) : (
                `${shipping.toFixed(2)} ${c.ron}`
              )}
            </span>
          </div>
          {subtotal < 50 && (
            <p className="text-xs text-muted-foreground">
              {cartT.freeShippingNote.replace("{amount}", (50 - subtotal).toFixed(2))}
            </p>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">{checkoutT.tax}</span>
            <span>{tax.toFixed(2)} {c.ron}</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>{cartT.total}</span>
          <span>{total.toFixed(2)} {c.ron}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
          <Lock className="h-3 w-3" />
          <span>{checkoutT.securePayment}</span>
        </div>
      </CardContent>
    </Card>
  );
}

