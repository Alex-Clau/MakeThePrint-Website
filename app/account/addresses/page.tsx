import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { getUserProfile } from "@/lib/supabase/user-profiles";
import { createClient } from "@/lib/supabase/server";
import { AddressesContent } from "@/components/addresses/addresses-content";

async function AddressesData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getUserProfile(user.id);
  const addresses = (profile?.shipping_addresses as any[]) || [];

  return <AddressesContent addresses={addresses} userId={user.id} />;
}

export default function AddressesPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">My Addresses</h1>

        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-12 bg-muted animate-pulse rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            </div>
          }
        >
          <AddressesData />
        </Suspense>
      </div>
    </main>
  );
}

