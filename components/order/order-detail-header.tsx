"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Truck, CheckCircle } from "lucide-react";
import Link from "next/link";
import { OrderDetailHeaderProps } from "@/types/order";
import { messages } from "@/lib/messages";
import { orderStatusBadgeClassName, orderStatusLabelRo } from "@/lib/utils/order-status-ui";

export function OrderDetailHeader({
  orderId,
  status,
  createdAt,
  totalAmount,
  subtotal,
}: OrderDetailHeaderProps) {
  const t = messages.account;
  const c = messages.common;
  const cart = messages.cart;
  const orderDate = new Date(createdAt).toLocaleDateString("ro-RO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const shippingFee = Math.max(0, totalAmount - subtotal);
  const badgeClass = orderStatusBadgeClassName(status);

  return (
    <div className="mb-6 sm:mb-8">
      <Button variant="ghost" asChild className="mb-4 h-9 sm:h-10 text-sm" size="sm">
        <Link href="/account/orders" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t.backToOrders}
        </Link>
      </Button>
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {t.orderHeading} #{orderId.slice(0, 8)}
            </h1>
            <Badge variant="outline" className={`text-xs font-medium ${badgeClass}`}>
              {orderStatusLabelRo(status)}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">{t.placedOn} {orderDate}</p>
        </div>
        <div className="min-w-0 space-y-0 rounded-lg border border-border/80 bg-muted/20 px-3 py-3 sm:px-4 sm:py-3">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="shrink-0 rounded-lg bg-primary/10 p-2 sm:p-2.5">
                {status === "delivered" ? (
                  <CheckCircle className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                ) : status === "shipped" ? (
                  <Truck className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                ) : status === "confirmed" ? (
                  <CheckCircle className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                ) : (
                  <Package className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                )}
              </div>
              <span className="text-sm font-semibold text-foreground sm:text-base">{t.total}</span>
            </div>
            <span className="shrink-0 text-xl font-bold tabular-nums sm:text-2xl">
              {totalAmount.toFixed(2)} {c.ron}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 pt-3 text-sm">
            <span className="text-muted-foreground">{cart.subtotal}</span>
            <span className="font-medium tabular-nums">{subtotal.toFixed(2)} {c.ron}</span>
          </div>
          <div className="flex items-center justify-between gap-3 pt-2 text-sm">
            <span className="text-muted-foreground">{cart.shipping}</span>
            <span className="font-medium tabular-nums">
              {shippingFee <= 0 ? cart.free : `${shippingFee.toFixed(2)} ${c.ron}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

