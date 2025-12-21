import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle } from "lucide-react";
import Link from "next/link";

const orders = [
  {
    id: "12345",
    date: "January 15, 2024",
    status: "Shipped",
    total: 79.97,
    items: 3,
  },
  {
    id: "12344",
    date: "January 10, 2024",
    status: "Delivered",
    total: 29.99,
    items: 1,
  },
  {
    id: "12343",
    date: "January 5, 2024",
    status: "Delivered",
    total: 49.99,
    items: 2,
  },
];

export default function OrdersPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Order History</h1>
          <Button variant="outline" asChild>
            <Link href="/account">Back to Account</Link>
          </Button>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      {order.status === "Delivered" ? (
                        <CheckCircle className="h-6 w-6 text-primary" />
                      ) : (
                        <Truck className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "default"
                              : order.status === "Shipped"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {order.date}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.items} item{order.items > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href={`/account/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

