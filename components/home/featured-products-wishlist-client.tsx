"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import type { ProductCardData } from "@/types/product";

type Props = {
  cards: ProductCardData[];
  wishlistProductIds: string[];
};

export function FeaturedProductsWishlistClient({ cards, wishlistProductIds }: Props) {
  const [wishlistIds, setWishlistIds] = useState(() => new Set(wishlistProductIds));

  useEffect(() => {
    const sync = () => {
      void fetch("/api/wishlist/ids")
        .then((res) => res.json())
        .then((data: { productIds?: string[] }) => {
          setWishlistIds(new Set(data.productIds ?? []));
        })
        .catch(() => {
          /* keep last known ids */
        });
    };
    window.addEventListener("wishlist-updated", sync);
    return () => window.removeEventListener("wishlist-updated", sync);
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
