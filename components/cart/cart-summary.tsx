"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CartSummaryProps } from "@/types/cart-components";
import { useTranslations } from "@/components/locale-provider";

export function CartSummary({ subtotal, shipping, total }: CartSummaryProps) {
  const t = useTranslations().cart;
  const c = useTranslations().common;
  return (
    <Card className="lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">{t.orderSummary}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t.subtotal}</span>
            <span>{subtotal.toFixed(2)} {c.ron}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t.shipping}</span>
            <span>
              {shipping === 0 ? (
                <span className="text-green-600">{t.free}</span>
              ) : (
                `${shipping.toFixed(2)} ${c.ron}`
              )}
            </span>
          </div>
          {subtotal < 50 && (
            <p className="text-xs text-muted-foreground">
              {t.freeShippingNote.replace("{amount}", (50 - subtotal).toFixed(2))}
            </p>
          )}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>{t.total}</span>
            <span>{total.toFixed(2)} {c.ron}</span>
          </div>
        </div>
        <Button className="w-full" size="lg" asChild>
          <Link href="/checkout" className="flex items-center justify-center gap-2">
            {t.checkout}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/products">{t.continueShopping}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

