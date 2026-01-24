import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lock } from "lucide-react";
import { OrderSummaryProps } from "@/types/checkout";
import { OrderItem } from "./order-item";

export function OrderSummary({
  cartItems,
  subtotal,
  shipping,
  tax,
  total,
}: OrderSummaryProps) {
  return (
    <Card className="lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
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
            <span className="text-muted-foreground">Subtotal</span>
            <span>{subtotal.toFixed(2)} RON</span>
          </div>
          <div className="flex justify-between">
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
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>{tax.toFixed(2)} RON</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{total.toFixed(2)} RON</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
          <Lock className="h-3 w-3" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </CardContent>
    </Card>
  );
}

