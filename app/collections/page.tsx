import { PageLayout } from "@/components/layout/page-layout";
import { Sparkles, Gift } from "lucide-react";
import { getProducts } from "@/lib/supabase/products";
import { getWishlist } from "@/lib/supabase/wishlist";
import { getProductReviewStats } from "@/lib/supabase/reviews";
import { createClient } from "@/lib/supabase/server";
import { transformProductToCardData } from "@/lib/utils/products";
import { ProductCard } from "@/components/product/product-card";
import { messages } from "@/lib/messages";
import type { Messages } from "@/lib/messages";

async function SeasonalCollections({ messages }: { messages: Messages }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [products, wishlistItems] = await Promise.all([
    getProducts({ seasonal: true, limit: 12 }),
    user != null ? getWishlist(user.id) : Promise.resolve([]),
  ]);
  const reviewStats = await getProductReviewStats(products.map((p) => p.id));
  const transformedProducts = products.map((p) => {
    const stats = reviewStats.get(p.id);
    return transformProductToCardData({ ...p, rating: stats?.rating, review_count: stats?.review_count });
  });
  const wishlistProductIds = new Set(
    wishlistItems.map((item) =>
      typeof item.products === "object" && item.products != null && "id" in item.products
        ? String((item.products as { id: string }).id)
        : (item as { product_id: string }).product_id
    )
  );
  const t = messages.seasons;

  return (
    <div className="space-y-8">
      {transformedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6">
          {transformedProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              isInWishlist={wishlistProductIds.has(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t.noSeasonal}</p>
        </div>
      )}
    </div>
  );
}

export default async function CollectionsPage() {
  const t = messages.seasons;

  return (
    <PageLayout
      mainClassName="relative z-10 bg-background"
      title={
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-accent-primary-dark" />
            <h1 className="text-3xl sm:text-4xl font-bold text-accent-primary-dark">
              {t.title}
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            {t.subhead}
          </p>
        </div>
      }
      padding="relaxed"
    >
      <SeasonalCollections messages={messages} />
    </PageLayout>
  );
}

