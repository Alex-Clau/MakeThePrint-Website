import { NextResponse } from "next/server";
import { getHomepageFeaturedProducts } from "@/lib/supabase/products";
import { getProductReviewStats } from "@/lib/supabase/reviews";
import { transformProductToCardData } from "@/lib/utils/products";

export async function GET() {
  try {
    const products = await getHomepageFeaturedProducts(4);
    const reviewStats = await getProductReviewStats(products.map((p) => p.id));

    const cardProducts = products.map((p) => {
      const stats = reviewStats.get(p.id);
      return transformProductToCardData({
        ...p,
        rating: stats?.rating,
        review_count: stats?.review_count,
      });
    });

    return NextResponse.json({ products: cardProducts });
  } catch (error) {
    return NextResponse.json({ products: [] });
  }
}

