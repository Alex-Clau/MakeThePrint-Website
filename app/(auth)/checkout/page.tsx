import { PageLayout } from "@/components/layout/page-layout";
import { CheckoutContent } from "@/components/checkout/checkout-content";
import { getCartItems } from "@/lib/supabase/cart";
import { getRequiredUser } from "@/lib/supabase/server";

async function CheckoutData() {
  const user = await getRequiredUser();
  const cartItems = await getCartItems(user.id);

  return <CheckoutContent cartItems={cartItems} userId={user.id} />;
}

export default function CheckoutPage() {
  return (
    <PageLayout title="Checkout">
      <CheckoutData />
    </PageLayout>
  );
}
