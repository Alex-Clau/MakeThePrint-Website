"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Truck, CheckCircle } from "lucide-react";
import Link from "next/link";
import { OrderDetailHeaderProps } from "@/types/order";
import { useTranslations } from "@/components/locale-provider";

export function OrderDetailHeader({
  orderId,
  status,
  createdAt,
  totalAmount,
}: OrderDetailHeaderProps) {
  const t = useTranslations().account;
  const c = useTranslations().common;
  const orderDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
              Order #{orderId.slice(0, 8)}
            </h1>
            <Badge
              variant={
                status === "delivered"
                  ? "default"
                  : status === "shipped"
                  ? "secondary"
                  : status === "confirmed"
                  ? "default"
                  : "outline"
              }
              className="text-xs"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">{t.placedOn} {orderDate}</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
            {status === "delivered" ? (
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            ) : status === "shipped" ? (
              <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            ) : status === "confirmed" ? (
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            ) : (
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            )}
          </div>
          <div className="text-right flex-1 sm:flex-none">
            <p className="text-xs sm:text-sm text-muted-foreground">{t.total}</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {totalAmount.toFixed(2)} {c.ron}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

