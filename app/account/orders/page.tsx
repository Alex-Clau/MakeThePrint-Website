import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getOrders } from "@/lib/supabase/orders";
import { createClient } from "@/lib/supabase/server";

async function OrdersList() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const orders = await getOrders(user.id);

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No orders found</p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    {order.status === "delivered" ? (
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    ) : order.status === "confirmed" ? (
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    ) : (
                      <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="font-semibold text-base sm:text-lg">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "shipped"
                            ? "secondary"
                            : order.status === "confirmed"
                            ? "default"
                            : "outline"
                        }
                        className="w-fit text-xs"
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Placed on {orderDate}
                    </p>
                    <p className="text-sm sm:text-base font-semibold mt-1 sm:hidden">
                      {order.total_amount.toFixed(2)} RON
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 border-t sm:border-0">
                  <div className="hidden sm:block text-right">
                    <p className="text-xl sm:text-2xl font-bold">
                      {order.total_amount.toFixed(2)} RON
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="h-9 sm:h-10" asChild>
                    <Link href={`/account/orders/${order.id}`}>View Details</Link>
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

export default function OrdersPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Order History</h1>
          <Button variant="outline" size="sm" className="h-9 sm:h-10 w-full sm:w-auto" asChild>
            <Link href="/account">Back to Account</Link>
          </Button>
        </div>

        <Suspense
          fallback={
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          }
        >
          <OrdersList />
        </Suspense>
      </div>
    </main>
  );
}

