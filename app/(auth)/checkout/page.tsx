import { PageLayout } from "@/components/layout/page-layout";
import { CheckoutContent } from "@/components/checkout/checkout-content";
import { getCartItems } from "@/lib/supabase/cart";
import { getRequiredUser } from "@/lib/supabase/server";
import { messages } from "@/lib/messages";

async function CheckoutData() {
  const user = await getRequiredUser();
  const cartItems = await getCartItems(user.id);

  return <CheckoutContent cartItems={cartItems} userId={user.id} />;
}

export default function CheckoutPage() {
  const t = messages.checkout;
  return (
    <PageLayout title={t.title}>
      <CheckoutData />
    </PageLayout>
  );
}
