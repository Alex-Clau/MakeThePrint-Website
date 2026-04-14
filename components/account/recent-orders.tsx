import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getOrders } from "@/lib/supabase/orders";
import { RecentOrdersProps } from "@/types/account";
import { messages } from "@/lib/messages";

const ORDER_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export async function RecentOrders({ userId }: RecentOrdersProps) {
  const orders = await getOrders(userId);
  const recentOrders = orders.slice(0, 3); // Show only 3 most recent
  const t = messages.account;
  const c = messages.common;

  if (recentOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.recentOrders}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">{t.recentOrdersEmpty}</p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/products">{c.browseProducts}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.recentOrders}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => {
            const orderDate = new Date(order.created_at).toLocaleDateString("ro-RO", ORDER_DATE_OPTIONS);

            return (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 border rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base">
                    {t.orderHeading} #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t.placedOn} {orderDate}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-sm sm:text-base">
                      {order.total_amount.toFixed(2)} {c.ron}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                      {order.status}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="h-9 sm:h-10" asChild>
                    <Link href={`/account/orders/${order.id}`}>{t.viewOrder}</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/account/orders">{t.viewAllOrders}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

