import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getOrders } from "@/lib/supabase/orders";
import { RecentOrdersProps } from "@/types/account";

export async function RecentOrders({ userId }: RecentOrdersProps) {
  const orders = await getOrders(userId);
  const recentOrders = orders.slice(0, 3); // Show only 3 most recent

  if (recentOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No orders yet. Start shopping to see your orders here!
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => {
            const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 border rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Placed on {orderDate}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-sm sm:text-base">{order.total_amount.toFixed(2)} RON</p>
                    <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                      {order.status}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="h-9 sm:h-10" asChild>
                    <Link href={`/account/orders/${order.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/account/orders">View All Orders</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

