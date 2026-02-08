import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Suspense} from "react";

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="space-y-6">Loading orders...</div>}>
      <AdminOrdersContent/>
    </Suspense>
  );
}


async function AdminOrdersContent() {
  const { createClient } = await import("@/lib/supabase/server");
  const { getAllOrdersAdmin } = await import("@/lib/supabase/orders-admin");
  const { redirect } = await import("next/navigation");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/admin/orders");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_admin")
    .eq("id", user?.id)
    .single();
  if (!profile?.is_admin) redirect("/?error=unauthorized");

  const orders = await getAllOrdersAdmin();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>All orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Order</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Payment</th>
                  <th className="text-right py-2">Total</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => {
                  const addr = (order.shipping_address as Record<string, unknown>) || {};
                  const email = (addr.email as string) || "—";
                  return (
                    <tr
                      key={order.id}
                      className="border-b"
                    >
                      <td className="py-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-accent-primary-dark hover:underline"
                        >
                          {order.id.slice(0, 8)}
                        </Link>
                        <span className="block text-xs text-muted-foreground">{email}</span>
                      </td>
                      <td className="py-2">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-2 capitalize">{order.status}</td>
                      <td className="py-2 capitalize">{order.payment_status}</td>
                      <td className="py-2 text-right">{order.total_amount.toFixed(2)} RON</td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
