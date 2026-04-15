import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminOrdersPage } from "@/lib/supabase/orders-admin";
import { AdminOrdersList } from "@/components/admin/admin-orders-list";
import { messages } from "@/lib/messages";

const PAGE_SIZE = 12;

export default async function AdminOrdersPage() {
  const { orders, hasMore } = await getAdminOrdersPage({ page: 1, pageSize: PAGE_SIZE });
  const a = messages.admin;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{a.adminNavOrders}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{a.allOrdersTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminOrdersList
            initialOrders={orders}
            initialPage={1}
            pageSize={PAGE_SIZE}
            initialHasMore={hasMore}
          />
        </CardContent>
      </Card>
    </div>
  );
}

