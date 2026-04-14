import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getOrders } from "@/lib/supabase/orders";
import { getRequiredUser } from "@/lib/supabase/server";
import { messages } from "@/lib/messages";
import { orderStatusBadgeClassName, orderStatusLabelRo } from "@/lib/utils/order-status-ui";

const ORDER_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

async function OrdersList() {
  const user = await getRequiredUser();
  const t = messages.account;
  const c = messages.common;

  const orders = await getOrders(user.id);

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{t.noOrdersFound}</p>
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
                    <div className="rounded-lg bg-primary/10 p-2 sm:p-3 shrink-0">
                      {order.status === "delivered" ? (
                        <CheckCircle className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                      ) : order.status === "confirmed" ? (
                        <CheckCircle className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                      ) : order.status === "shipped" ? (
                        <Truck className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                      ) : (
                        <Truck className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                      )}
                    </div>
                    <h3 className="pt-0.5 font-semibold text-base leading-snug sm:text-lg">
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
                  <div className="hidden sm:block text-right">
                    <p className="text-xl sm:text-2xl font-bold">
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
    </div>
  );
}

export default async function OrdersPage() {
  const c = messages.common;
  const t = messages.account;
  return (
    <PageLayout
      title={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{c.orderHistory}</h1>
          <Button variant="outline" size="sm" className="h-9 sm:h-10 w-full sm:w-auto" asChild>
            <Link href="/account">{t.backToAccount}</Link>
          </Button>
        </div>
      }
    >
      <OrdersList />
    </PageLayout>
  );
}

