import { getPublicSeasonalProductsPage } from "@/lib/supabase/products";
import { getProductReviewStats } from "@/lib/supabase/reviews";
import { transformProductToCardData } from "@/lib/utils/products";
import type { ProductCardData } from "@/types/product";

/**
 * Single owner for seasonal products grid: listing query + review aggregates + card mapping.
 * Used by the collections page (SSR) and GET /api/products/seasonal (infinite scroll).
 */
export async function fetchSeasonalProductCardsPage(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<{ products: ProductCardData[]; hasMore: boolean }> {
  const { products, hasMore } = await getPublicSeasonalProductsPage(params);
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
