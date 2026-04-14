import { PageLayout } from "@/components/layout/page-layout";
import { getWishlist } from "@/lib/supabase/wishlist";
import { getRequiredUser } from "@/lib/supabase/server";
import { WishlistContent } from "@/components/wishlist/wishlist-content";
import { messages } from "@/lib/messages";

export default async function WishlistPage() {
  const user = await getRequiredUser();
  const items = await getWishlist(user.id);
  const t = messages.account;

  return (
    <PageLayout title={<h1 className="text-3xl sm:text-4xl font-bold">{t.myWishlist}</h1>} padding="relaxed">
      <WishlistContent items={items} userId={user.id} />
    </PageLayout>
  );
}
