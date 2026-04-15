"use client";

import { useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Truck } from "lucide-react";
import { messages } from "@/lib/messages";
import { getApiErrorBody } from "@/lib/utils/api-error";
import { orderStatusBadgeClassName, orderStatusLabelRo } from "@/lib/utils/order-status-ui";
import { useInfiniteScrollList } from "@/lib/hooks/use-infinite-scroll-list";

const ORDER_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

type AccountOrderListItem = {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
};

type AccountOrdersInfiniteListProps = {
  initialOrders: AccountOrderListItem[];
  initialPage: number;
  pageSize: number;
  initialHasMore: boolean;
};

type AccountOrdersApiResponse = {
  orders: AccountOrderListItem[];
  hasMore: boolean;
};

export function AccountOrdersInfiniteList({
  initialOrders,
  initialPage,
  pageSize,
  initialHasMore,
}: AccountOrdersInfiniteListProps) {
  const t = messages.account;
  const c = messages.common;

  const loadPage = useCallback(
    async (page: number) => {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
      });
      const res = await fetch(`/api/account/orders?${params.toString()}`);
      if (!res.ok) {
        const { message } = await getApiErrorBody(res);
        throw new Error(message);
      }
      const body = (await res.json()) as AccountOrdersApiResponse;
      return { items: body.orders, hasMore: body.hasMore };
    },
    [pageSize]
  );

  const { items: orders, hasMore, isLoading, error, sentinelRef } =
    useInfiniteScrollList<AccountOrderListItem>({
      initialItems: initialOrders,
      initialPage,
      initialHasMore,
      resetKey: "account-orders",
      loadPage,
      defaultError: t.ordersLoadMoreFailed,
    });

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-muted-foreground">{t.noOrdersFound}</p>
        <Button asChild>
          <Link href="/products">{t.startShopping}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const orderDate = new Date(order.created_at).toLocaleDateString("ro-RO", ORDER_DATE_OPTIONS);
        return (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                    <div className="shrink-0 rounded-lg bg-primary/10 p-2 sm:p-3">
                      {order.status === "delivered" || order.status === "confirmed" ? (
                        <CheckCircle className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                      ) : (
                        <Truck className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                      )}
                    </div>
                    <h3 className="pt-0.5 text-base font-semibold leading-snug sm:text-lg">
                      {t.orderHeading} #{order.id.slice(0, 8)}
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className={`shrink-0 px-2.5 py-1 text-xs font-semibold sm:self-start ${orderStatusBadgeClassName(order.status)}`}
                  >
                    {orderStatusLabelRo(order.status)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {t.placedOn} {orderDate}
                </p>
                <p className="text-sm font-semibold sm:hidden">
                  {order.total_amount.toFixed(2)} {c.ron}
                </p>
                <div className="flex items-center justify-between gap-4 border-t pt-3 sm:justify-end sm:border-0 sm:pt-0">
                  <div className="hidden text-right sm:block">
                    <p className="text-xl font-bold sm:text-2xl">
                      {order.total_amount.toFixed(2)} {c.ron}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="h-9 sm:h-10" asChild>
                    <Link href={`/account/orders/${order.id}`}>{t.viewDetails}</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <div ref={sentinelRef} className="h-10" />
      {isLoading && <p className="mt-2 text-center text-sm text-muted-foreground">{t.ordersLoadingMore}</p>}
      {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}
      {!hasMore && <p className="mt-4 text-center text-xs text-muted-foreground">{t.ordersEndOfList}</p>}
    </div>
  );
}
