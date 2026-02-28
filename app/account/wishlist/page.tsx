import { redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { getWishlist } from "@/lib/supabase/wishlist";
import { createClient } from "@/lib/supabase/server";
import { WishlistContent } from "@/components/wishlist/wishlist-content";
import { messages } from "@/lib/messages";

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
  const t = messages.account;
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">{t.myWishlist}</h1>

        <WishlistItems />
      </div>
    </main>
  );
}

