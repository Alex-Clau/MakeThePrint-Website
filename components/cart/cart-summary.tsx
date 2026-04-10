"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CartSummaryProps } from "@/types/cart-components";
import { messages } from "@/lib/messages";

export function CartSummary({ subtotal, total }: CartSummaryProps) {
  const t = messages.cart;
  const c = messages.common;
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

