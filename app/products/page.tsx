import { PageLayout } from "@/components/layout/page-layout";
import { ProductsContent } from "@/components/product/products-content";
import { getProducts } from "@/lib/supabase/products";
import { getWishlist } from "@/lib/supabase/wishlist";
import { getProductReviewStats } from "@/lib/supabase/reviews";
import { createClient } from "@/lib/supabase/server";
import { transformProductToCardData } from "@/lib/utils/products";
import { messages } from "@/lib/messages";

async function ProductsList() {
  const supabase = await createClient();
  const [products, { data: { user } }] = await Promise.all([
    getProducts({ product_type: "custom" }),
    supabase.auth.getUser(),
  ]);
  const reviewStats = await getProductReviewStats(products.map((p) => p.id));
  const transformedProducts = products.map((p) => {
    const stats = reviewStats.get(p.id);
    return transformProductToCardData({ ...p, rating: stats?.rating, review_count: stats?.review_count });
  });
  const wishlistProductIds =
    user != null
      ? (await getWishlist(user.id)).map((item) =>
          typeof item.products === "object" && item.products != null && "id" in item.products
            ? String((item.products as { id: string }).id)
            : (item as { product_id: string }).product_id
        )
      : [];
  return (
    <ProductsContent
      products={transformedProducts}
      wishlistProductIds={wishlistProductIds}
    />
  );
}

export default async function ProductsPage() {
  const t = messages.products;

  return (
    <PageLayout
      titleClassName="mb-0"
      title={
        <div className="mb-6 sm:mb-8 border-b border-accent-primary/30 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-accent-primary-dark">
                {t.title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t.subhead}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <ProductsList />
    </PageLayout>
  );
}

