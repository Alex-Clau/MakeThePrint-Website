import { redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { CartContent } from "@/components/cart/cart-content";
import { getCartItems } from "@/lib/supabase/cart";
import { createClient } from "@/lib/supabase/server";

async function CartItems() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const items = await getCartItems(user.id);
  return <CartContent items={items} userId={user.id} />;
}

export default function CartPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8">
          Shopping Cart
        </h1>

        <CartItems />
      </div>
    </main>
  );
}

