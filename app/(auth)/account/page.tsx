import { PageLayout } from "@/components/layout/page-layout";
import { getRequiredUser } from "@/lib/supabase/server";
import { RecentOrders } from "@/components/account/recent-orders";
import { AccountMenu } from "@/components/account/account-menu";
import { messages } from "@/lib/messages";

export default async function AccountPage() {
  const user = await getRequiredUser();
  const t = messages.account;

  return (
    <PageLayout title={t.myAccount}>
      <AccountMenu />
      <RecentOrders userId={user.id} />
    </PageLayout>
  );
}
