import { PageLayout } from "@/components/layout/page-layout";
import { CartContent } from "@/components/cart/cart-content";
import { getCartItems } from "@/lib/supabase/cart";
import { getRequiredUser } from "@/lib/supabase/server";

async function CartItems() {
  const user = await getRequiredUser();
  const items = await getCartItems(user.id);
  return <CartContent items={items} userId={user.id} />;
}

export default function CartPage() {
  return (
    <PageLayout title="Shopping Cart" padding="tight" titleClassName="mb-4 sm:mb-6 lg:mb-8">
      <CartItems />
    </PageLayout>
  );
}

