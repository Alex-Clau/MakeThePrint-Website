import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { CheckoutContent } from "@/components/checkout/checkout-content";
import { getCartItems } from "@/lib/supabase/cart";
import { createClient } from "@/lib/supabase/server";

async function CheckoutData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const cartItems = await getCartItems(user.id);

  return <CheckoutContent cartItems={cartItems} userId={user.id} />;
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">Checkout</h1>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-muted animate-pulse rounded-lg" />
                <div className="h-64 bg-muted animate-pulse rounded-lg" />
              </div>
              <div className="h-96 bg-muted animate-pulse rounded-lg" />
            </div>
          }
        >
          <CheckoutData />
        </Suspense>
      </div>
    </main>
  );
}
