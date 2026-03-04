"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import type { ProductCardData } from "@/types/product";
import { messages } from "@/lib/messages";

export function HomepageFeaturedProductsClient() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = messages.home;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/featured-products");
        if (!res.ok) {
          throw new Error("Request failed");
        }
        const data = await res.json();
        if (!cancelled) {
          setProducts(data.products ?? []);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("Nu am putut încărca produsele recomandate.");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const showSkeleton = loading && products.length === 0 && !error;

  return (
    <section className="py-8 sm:py-12 lg:py-16 xl:py-24 border-b border-accent-primary/30">
      <div className="max-w-7xl mx-auto px-5 sm:px-4 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-2xl sm:3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4 text-accent-primary-dark">
            {t.featuredTitle}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            {t.featuredSubhead}
          </p>
        </div>

        {error && (
          <p className="text-center text-sm text-red-500">
            {error}
          </p>
        )}

        {showSkeleton && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="mx-3 sm:mx-0 h-full rounded-xl border border-accent-primary-light/20 bg-muted animate-pulse"
              >
                <div className="aspect-[4/3] sm:aspect-square bg-muted-foreground/10 rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted-foreground/10 rounded w-3/4" />
                  <div className="h-4 bg-muted-foreground/10 rounded w-1/3" />
                  <div className="h-4 bg-muted-foreground/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!showSkeleton && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}

        {!showSkeleton && !error && products.length === 0 && (
          <p className="text-center text-muted-foreground">
            {t.noFeatured}
          </p>
        )}
      </div>
    </section>
  );
}

