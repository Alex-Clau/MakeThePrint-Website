import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { RecentOrders } from "@/components/account/recent-orders";
import { AccountMenu } from "@/components/account/account-menu";

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
      <Suspense
        fallback={
          <Card>
            <CardContent className="p-6">
              <div className="h-32 bg-muted animate-pulse rounded-lg" />
            </CardContent>
          </Card>
        }
      >
        <RecentOrders userId={user.id} />
      </Suspense>
    </>
  );
}

export default function AccountPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">My Account</h1>
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
              <div className="h-64 bg-muted animate-pulse rounded-lg" />
            </div>
          }
        >
          <AccountContent />
        </Suspense>
      </div>
    </main>
  );
}

