"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CartSummaryProps } from "@/types/cart-components";

export function CartSummary({ subtotal, shipping, total }: CartSummaryProps) {
  return (
    <Card className="lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{subtotal.toFixed(2)} RON</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>
              {shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                `${shipping.toFixed(2)} RON`
              )}
            </span>
          </div>
          {subtotal < 50 && (
            <p className="text-xs text-muted-foreground">
              Add {(50 - subtotal).toFixed(2)} RON more for free shipping
            </p>
          )}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{total.toFixed(2)} RON</span>
          </div>
        </div>
        <Button className="w-full" size="lg" asChild>
          <Link href="/checkout" className="flex items-center justify-center gap-2">
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

