import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/page-layout";
import { getOrderById } from "@/lib/supabase/orders";
import { getRequiredUser } from "@/lib/supabase/server";
import { OrderDetailHeader } from "@/components/order/order-detail-header";
import { OrderItemsList } from "@/components/order/order-items-list";
import { OrderShippingInfo } from "@/components/order/order-shipping-info";
import type { OrderDetailPageParams } from "@/types/pages";
import type { OrderItem } from "@/types/order";

async function OrderDetailContent({ orderId }: { orderId: string }) {
  const user = await getRequiredUser();
  const order = await getOrderById(orderId, user.id);
  if (!order) {
    notFound();
  }

  const items = (order.order_items ?? []) as OrderItem[];
  const subtotal = items.reduce((sum, row) => sum + row.price * row.quantity, 0);

  return (
    <div className="space-y-6">
      <OrderDetailHeader
        orderId={order.id}
        status={order.status}
        createdAt={order.created_at}
        totalAmount={order.total_amount}
        subtotal={subtotal}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrderItemsList items={order.order_items || []} />
        </div>
        <div className="lg:col-span-1">
          <OrderShippingInfo
            shippingAddress={order.shipping_address}
            trackingNumber={order.tracking_number || undefined}
          />
        </div>
      </div>
    </div>
  );
}

async function OrderDetailWrapper({ params }: OrderDetailPageParams) {
  const { id } = await params;
  return <OrderDetailContent orderId={id} />;
}

export default function OrderDetailPage({ params }: OrderDetailPageParams) {
  return (
    <PageLayout>
      <OrderDetailWrapper params={params} />
    </PageLayout>
  );
}
