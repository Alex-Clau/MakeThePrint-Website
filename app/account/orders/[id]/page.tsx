import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { getOrderById } from "@/lib/supabase/orders";
import { createClient } from "@/lib/supabase/server";
import { OrderDetailHeader } from "@/components/order/order-detail-header";
import { OrderItemsList } from "@/components/order/order-items-list";
import { OrderShippingInfo } from "@/components/order/order-shipping-info";
import { notFound } from "next/navigation";

interface OrderDetailPageParams {
  params: Promise<{ id: string }>;
}

async function OrderDetailContent({ orderId }: { orderId: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const order = await getOrderById(orderId, user.id);
  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <OrderDetailHeader
        orderId={order.id}
        status={order.status}
        createdAt={order.created_at}
        totalAmount={order.total_amount}
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
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="h-32 bg-muted animate-pulse rounded-lg" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-64 bg-muted animate-pulse rounded-lg" />
                <div className="h-64 bg-muted animate-pulse rounded-lg" />
              </div>
            </div>
          }
        >
          <OrderDetailWrapper params={params} />
        </Suspense>
      </div>
    </main>
  );
}

