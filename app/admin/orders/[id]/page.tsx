import { getOrderByIdAdmin } from "@/lib/supabase/orders-admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderItemsList } from "@/components/order/order-items-list";
import { OrderShippingInfo } from "@/components/order/order-shipping-info";
import { OrderStatusForm } from "./order-status-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  let order: Awaited<ReturnType<typeof getOrderByIdAdmin>>;
  try {
    order = await getOrderByIdAdmin(id);
  } catch {
    notFound();
  }

  const addr = (order.shipping_address as Record<string, unknown>) || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="text-accent-primary-dark hover:underline">
          ← Orders
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Order {order.id.slice(0, 8)}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleString()} · {order.status} · {order.payment_status}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <OrderStatusForm
            orderId={order.id}
            currentStatus={order.status}
            currentTracking={order.tracking_number ?? undefined}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <OrderItemsList items={order.order_items || []} />
            </div>
            <div>
              <OrderShippingInfo
                shippingAddress={{
                  firstName: addr.firstName,
                  lastName: addr.lastName,
                  email: addr.email,
                  address: addr.address,
                  city: addr.city,
                  state: addr.state,
                  zip: addr.zip,
                  country: addr.country,
                  phone: addr.phone,
                }}
                trackingNumber={order.tracking_number ?? undefined}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
