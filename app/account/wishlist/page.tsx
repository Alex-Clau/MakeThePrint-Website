import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Navigation } from "@/components/navigation";
import { getWishlist } from "@/lib/supabase/wishlist";
import { createClient } from "@/lib/supabase/server";
import { WishlistContent } from "@/components/wishlist/wishlist-content";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";

async function WishlistItems() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const items = await getWishlist(user.id);
  return <WishlistContent items={items} userId={user.id} />;
}

export default async function WishlistPage() {
  const locale = getLocaleFromCookie((await cookies()).get("locale")?.value);
  const messages = getDictionary(locale);
  const t = messages.account;
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">{t.myWishlist}</h1>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          }
        >
          <WishlistItems />
        </Suspense>
      </div>
    </main>
  );
}

