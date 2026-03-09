import { PageLayout } from "@/components/layout/page-layout";
import { CheckoutContent } from "@/components/checkout/checkout-content";
import { getCartItems } from "@/lib/supabase/cart";
import { getUserProfile } from "@/lib/supabase/user-profiles";
import { getRequiredUser } from "@/lib/supabase/server";
import { messages } from "@/lib/messages";
import type { AddressFormData } from "@/types/address";

async function CheckoutData() {
  const user = await getRequiredUser();
  const [cartItems, profile] = await Promise.all([
    getCartItems(user.id),
    getUserProfile(user.id),
  ]);
  const savedAddresses = (profile?.shipping_addresses as AddressFormData[] | undefined) ?? [];

  return (
    <CheckoutContent
      cartItems={cartItems}
      userId={user.id}
      savedAddresses={savedAddresses}
      userEmail={user.email ?? undefined}
    />
  );
}

export default function CheckoutPage() {
  const t = messages.checkout;
  return (
    <PageLayout title={t.title}>
      <CheckoutData />
    </PageLayout>
  );
}
