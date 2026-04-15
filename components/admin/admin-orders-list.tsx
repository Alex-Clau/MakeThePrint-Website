"use client";

import { useCallback } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { messages } from "@/lib/messages";
import { getApiErrorBody } from "@/lib/utils/api-error";
import { useInfiniteScrollList } from "@/lib/hooks/use-infinite-scroll-list";

type AdminOrderListItem = {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  total_amount: number;
  shipping_address?: Record<string, unknown> | null;
};

type AdminOrdersListProps = {
  initialOrders: AdminOrderListItem[];
  initialPage: number;
  pageSize: number;
  initialHasMore: boolean;
};

type AdminOrdersApiResponse = {
  orders: AdminOrderListItem[];
  hasMore: boolean;
};

export function AdminOrdersList({
  initialOrders,
  initialPage,
  pageSize,
  initialHasMore,
}: AdminOrdersListProps) {
  const a = messages.admin;

  const loadPage = useCallback(
    async (page: number) => {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
      });
      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (!res.ok) {
        const { message } = await getApiErrorBody(res);
        throw new Error(message);
      }
      const body = (await res.json()) as AdminOrdersApiResponse;
      return { items: body.orders, hasMore: body.hasMore };
    },
    [pageSize]
  );

  const { items: orders, hasMore, isLoading, error, sentinelRef } =
    useInfiniteScrollList<AdminOrderListItem>({
      initialItems: initialOrders,
      initialPage,
      initialHasMore,
      resetKey: "admin-orders",
      loadPage,
      defaultError: a.ordersLoadMoreFailed,
    });

  if (orders.length === 0) {
    return <p className="text-muted-foreground">{a.noOrdersYet}</p>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{a.orderColumnOrder}</TableHead>
            <TableHead>{a.orderColumnDate}</TableHead>
            <TableHead>{a.orderColumnStatus}</TableHead>
            <TableHead>{a.orderColumnPayment}</TableHead>
            <TableHead className="text-right">{a.orderColumnTotal}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const addr = (order.shipping_address as Record<string, unknown>) || {};
            const email = (addr.email as string) || "—";
            return (
              <TableRow key={order.id}>
                <TableCell>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-accent-primary-dark hover:underline"
                  >
                    {order.id.slice(0, 8)}
                  </Link>
                  <span className="block text-xs text-muted-foreground">{email}</span>
                </TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="capitalize">{order.status}</TableCell>
                <TableCell className="capitalize">{order.payment_status}</TableCell>
                <TableCell className="text-right">{order.total_amount.toFixed(2)} RON</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div ref={sentinelRef} className="h-10" />
      {isLoading && <p className="mt-2 text-center text-sm text-muted-foreground">{a.ordersLoadingMore}</p>}
      {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}
      {!hasMore && (
        <p className="mt-4 text-center text-xs text-muted-foreground">{a.ordersEndOfList}</p>
      )}
    </div>
  );
}
