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
        <AddressesData />
      </div>
    </main>
  );
}

