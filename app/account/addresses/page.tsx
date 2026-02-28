import { PageLayout } from "@/components/layout/page-layout";
import { getUserProfile } from "@/lib/supabase/user-profiles";
import { getRequiredUser } from "@/lib/supabase/server";
import { AddressesContent } from "@/components/addresses/addresses-content";

async function AddressesData() {
  const user = await getRequiredUser();
  const profile = await getUserProfile(user.id);
  const addresses = (profile?.shipping_addresses as any[]) || [];

  return <AddressesContent addresses={addresses} userId={user.id} />;
}

export default function AddressesPage() {
  return (
    <PageLayout title={<h1 className="text-3xl sm:text-4xl font-bold">My Addresses</h1>} padding="relaxed">
      <AddressesData />
    </PageLayout>
  );
}

