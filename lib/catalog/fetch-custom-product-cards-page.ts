import { getPublicCustomProductsPage } from "@/lib/supabase/products";
import { getProductReviewStats } from "@/lib/supabase/reviews";
import { transformProductToCardData } from "@/lib/utils/products";
import type { ProductCardData } from "@/types/product";

/**
 * Single owner for custom products grid: listing query + review aggregates + card mapping.
 * Used by the products page (SSR) and GET /api/products/catalog (infinite scroll).
 */
export async function fetchCustomProductCardsPage(params: {
  page: number;
  pageSize: number;
}): Promise<{ products: ProductCardData[]; hasMore: boolean }> {
  const { products, hasMore } = await getPublicCustomProductsPage(params);
  const reviewStats = await getProductReviewStats(products.map((p) => p.id));
  const cards = products.map((p) => {
    const stats = reviewStats.get(p.id);
    return transformProductToCardData({
      ...p,
      rating: stats?.rating,
      review_count: stats?.review_count,
    });
  });
  return { products: cards, hasMore };
}
