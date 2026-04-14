"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { fetchWishlistProductIdsFromApi } from "@/lib/supabase/wishlist-client";
import type { ProductCardData } from "@/types/product";
import { WISHLIST_UPDATED_EVENT } from "@/lib/wishlist/events";

type Props = {
  cards: ProductCardData[];
  wishlistProductIds: string[];
};

export function FeaturedProductsWishlistClient({ cards, wishlistProductIds }: Props) {
  const [wishlistIds, setWishlistIds] = useState(() => new Set(wishlistProductIds));

  useEffect(() => {
    const sync = () => {
      void fetchWishlistProductIdsFromApi().then((result) => {
        if (result.ok) {
          setWishlistIds(new Set(result.productIds));
        }
      });
    };
    window.addEventListener(WISHLIST_UPDATED_EVENT, sync);
    return () => window.removeEventListener(WISHLIST_UPDATED_EVENT, sync);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
      {cards.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          isInWishlist={wishlistIds.has(product.id)}
        />
      ))}
    </div>
  );
}
