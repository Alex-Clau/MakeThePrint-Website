import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getOrdersPage } from "@/lib/supabase/orders";
import { getRequiredUser } from "@/lib/supabase/server";
import { messages } from "@/lib/messages";
import { AccountOrdersInfiniteList } from "@/components/account/account-orders-infinite-list";

const PAGE_SIZE = 8;

async function OrdersList() {
  const user = await getRequiredUser();
  const { orders, hasMore } = await getOrdersPage({ userId: user.id, page: 1, pageSize: PAGE_SIZE });

  return (
    <AccountOrdersInfiniteList
      initialOrders={orders}
      initialPage={1}
      pageSize={PAGE_SIZE}
      initialHasMore={hasMore}
    />
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

