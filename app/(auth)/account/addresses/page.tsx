import { PageLayout } from "@/components/layout/page-layout";
import { getUserProfile } from "@/lib/supabase/user-profiles";
import { getRequiredUser } from "@/lib/supabase/server";
import { AddressesContent } from "@/components/addresses/addresses-content";
import { shippingAddressesFromProfile } from "@/types/address-components";
import { messages } from "@/lib/messages";

export default async function AddressesPage() {
  const user = await getRequiredUser();
  const profile = await getUserProfile(user.id);
  const addresses = shippingAddressesFromProfile(profile?.shipping_addresses);
  const t = messages.account;

  return (
    <PageLayout
      title={<h1 className="text-3xl sm:text-4xl font-bold">{t.myAddressesPageTitle}</h1>}
      padding="relaxed"
    >
      <AddressesContent addresses={addresses} userId={user.id} />
    </PageLayout>
  );
}

