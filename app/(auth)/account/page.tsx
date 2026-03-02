import { PageLayout } from "@/components/layout/page-layout";
import { getRequiredUser } from "@/lib/supabase/server";
import { RecentOrders } from "@/components/account/recent-orders";
import { AccountMenu } from "@/components/account/account-menu";
import { messages } from "@/lib/messages";

async function AccountContent() {
  const user = await getRequiredUser();

  return (
    <>
      <AccountMenu />
      <RecentOrders userId={user.id} />
    </>
  );
}

export default async function AccountPage() {
  const t = messages.account;
  return (
    <PageLayout title={t.myAccount}>
      <AccountContent />
    </PageLayout>
  );
}

