import { redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { createClient } from "@/lib/supabase/server";
import { RecentOrders } from "@/components/account/recent-orders";
import { AccountMenu } from "@/components/account/account-menu";
import { messages } from "@/lib/messages";

async function AccountContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

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
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">{t.myAccount}</h1>
        <AccountContent />
      </div>
    </main>
  );
}

