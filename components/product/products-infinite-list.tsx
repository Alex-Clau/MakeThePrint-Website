"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import type { Product, ProductCardData } from "@/types/product";
import { createClient } from "@/lib/supabase/client";

type ProductsInfiniteListProps = {
  initialProducts: ProductCardData[];
  initialPage: number;
  pageSize: number;
  initialHasMore: boolean;
};

export function ProductsInfiniteList({
  initialProducts,
  initialPage,
  pageSize,
  initialHasMore,
}: ProductsInfiniteListProps) {
  const [products, setProducts] = useState<ProductCardData[]>(initialProducts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(initialPage);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(initialHasMore);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(async (entries) => {
      const [entry] = entries;
      if (!entry.isIntersecting || loadingRef.current || !hasMoreRef.current) return;

      loadingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const nextPage = pageRef.current + 1;
        const supabase = createClient();
        const from = (nextPage - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, error, count } = await supabase
          .from("products")
          .select(
            "id, name, description, price, product_type, category, custom_config, featured, images, created_at, updated_at",
            { count: "exact" },
          )
          .eq("product_type", "custom")
          .order("created_at", { ascending: false })
          .range(from, to);

        if (error) {
          throw error;
        }

        const productsData = (data ?? []) as Product[];
        const total = count ?? productsData.length ?? 0;
        const hasMore = total ? to + 1 < total : productsData.length === pageSize;

        const cardData: ProductCardData[] = productsData.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.images?.[0] ?? "",
          category: p.category,
          featured: p.featured,
        }));

        setProducts((prev) => [...prev, ...cardData]);
        pageRef.current = nextPage;
        hasMoreRef.current = hasMore;
        setHasMore(hasMore);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load more products");
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    });

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [pageSize]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <div ref={sentinelRef} className="h-10" />
      {isLoading && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Se încarcă mai multe produse...
        </p>
      )}
      {error && (
        <p className="mt-4 text-center text-sm text-red-500">
          {error}
        </p>
      )}
      {!hasMore && (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Ai ajuns la finalul listei de produse.
        </p>
      )}
    </>
  );
}

