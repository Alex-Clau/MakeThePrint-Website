import { redirect } from "next/navigation";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Mail } from "lucide-react";
import Link from "next/link";
import { getOrderById } from "@/lib/supabase/orders";
import { getRequiredUser } from "@/lib/supabase/server";
import { messages } from "@/lib/messages";
import type { OrderConfirmationParams } from "@/types/pages";
import type { OrderShippingAddress } from "@/types/order";

async function OrderConfirmationContent({ orderId }: { orderId: string }) {
  const user = await getRequiredUser();
  const order = await getOrderById(orderId, user.id);
  if (!order) {
    redirect("/account/orders");
  }

  const t = messages.checkout;
  const c = messages.common;

  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const shipping = order.shipping_address as OrderShippingAddress;
  const confirmationEmail =
    typeof shipping?.email === "string" && shipping.email.trim().length > 0
      ? shipping.email
      : undefined;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {t.orderConfirmed}
          </h1>
          <p className="text-muted-foreground">
            {t.orderConfirmedThankYou}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{t.orderNumber}</p>
                <p className="font-semibold">#{order.id.slice(0, 8)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{t.orderDate}</p>
              <p className="font-semibold">{orderDate}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">{t.totalAmount}</p>
              <p className="text-2xl font-bold">{order.total_amount.toFixed(2)} {c.ron}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{t.status}</p>
              <p className="font-semibold capitalize">{order.status}</p>
            </div>
          </div>

          {confirmationEmail && (
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {t.confirmationEmailSent}
                </p>
                <p className="font-semibold">
                  {confirmationEmail}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1">
            <Link href={`/account/orders/${order.id}`}>{t.viewOrderDetails}</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/products">{t.continueShopping}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

async function OrderConfirmationWrapper({ params }: OrderConfirmationParams) {
  const { id } = await params;
  return <OrderConfirmationContent orderId={id} />;
}

export default function OrderConfirmationPage({
  params,
}: OrderConfirmationParams) {
  return (
    <PageLayout padding="relaxed">
      <OrderConfirmationWrapper params={params} />
    </PageLayout>
  );
}

