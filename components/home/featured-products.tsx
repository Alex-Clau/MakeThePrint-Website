import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/supabase/products";
import { getWishlist } from "@/lib/supabase/wishlist";
import { getProductReviewStats } from "@/lib/supabase/reviews";
import { createClient } from "@/lib/supabase/server";
import { transformProductToCardData } from "@/lib/utils/products";
import type { Messages } from "@/lib/messages";

export async function FeaturedProducts({ messages }: { messages: Messages }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [products, wishlistItems] = await Promise.all([
    getProducts({ featured: true, limit: 4 }),
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
  const t = messages.home;

  return (
    <section className="py-8 sm:py-12 lg:py-16 xl:py-24 border-b border-accent-primary/30">
      <div className="max-w-7xl mx-auto px-5 sm:px-4 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4 text-accent-primary-dark">
            {t.featuredTitle}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            {t.featuredSubhead}
          </p>
        </div>
        {transformedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            {transformedProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                isInWishlist={wishlistProductIds.has(product.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">{t.noFeatured}</p>
        )}
      </div>
    </section>
  );
}

