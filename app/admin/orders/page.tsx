import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminOrdersPage() {
  return <AdminOrdersContent />;
}


async function AdminOrdersContent() {
  const { getAllOrdersAdmin } = await import("@/lib/supabase/orders-admin");

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
