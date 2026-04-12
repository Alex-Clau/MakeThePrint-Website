"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import type { ProductCardData } from "@/types/product";
import { messages } from "@/lib/messages";
import { getApiErrorBody } from "@/lib/utils/api-error";

type ProductsInfiniteListProps = {
  initialProducts: ProductCardData[];
  initialPage: number;
  pageSize: number;
  initialHasMore: boolean;
};

type CatalogApiResponse = {
  products: ProductCardData[];
  hasMore: boolean;
  page: number;
  pageSize: number;
};

export function ProductsInfiniteList({
  initialProducts,
  initialPage,
  pageSize,
  initialHasMore,
}: ProductsInfiniteListProps) {
  const t = messages.products;
  const [products, setProducts] = useState<ProductCardData[]>(initialProducts);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(initialPage);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(initialHasMore);

  const refreshWishlistIds = useCallback(() => {
    fetch("/api/wishlist/ids")
      .then(async (res) => {
        if (!res.ok) {
          console.error("[wishlist/ids] refresh", res.status);
          return;
        }
        const data = (await res.json()) as { productIds?: string[] };
        setWishlistIds(new Set(data.productIds ?? []));
      })
      .catch((e) => {
        console.error("[wishlist/ids] refresh", e);
      });
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/wishlist/ids", { signal: ac.signal })
      .then(async (res) => {
        if (!res.ok) {
          console.error("[wishlist/ids] initial", res.status);
          return;
        }
        const data = (await res.json()) as { productIds?: string[] };
        setWishlistIds(new Set(data.productIds ?? []));
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.error("[wishlist/ids] initial", e);
      });
    return () => ac.abort();
  }, []);

  useEffect(() => {
    window.addEventListener("wishlist-updated", refreshWishlistIds);
    return () => window.removeEventListener("wishlist-updated", refreshWishlistIds);
  }, [refreshWishlistIds]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    let cancelled = false;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (!entry.isIntersecting || loadingRef.current || !hasMoreRef.current) return;

      void (async () => {
        loadingRef.current = true;
        if (!cancelled) {
          setIsLoading(true);
          setError(null);
        }

        try {
          const nextPage = pageRef.current + 1;
          const params = new URLSearchParams({
            page: String(nextPage),
            page_size: String(pageSize),
          });
          const res = await fetch(`/api/products/catalog?${params.toString()}`);

          if (!res.ok) {
            const { message } = await getApiErrorBody(res);
            throw new Error(message);
          }

          const body = (await res.json()) as CatalogApiResponse;
          const cardData = body.products;

          if (cancelled) return;

          setProducts((prev) => [...prev, ...cardData]);
          pageRef.current = nextPage;
          const nextHasMore = body.hasMore;
          hasMoreRef.current = nextHasMore;
          setHasMore(nextHasMore);
        } catch (e) {
          if (!cancelled) {
            setError(e instanceof Error ? e.message : t.loadMoreFailed);
          }
        } finally {
          loadingRef.current = false;
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      })();
    });

    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [pageSize, t.loadMoreFailed]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            isInWishlist={product.isInWishlist ?? wishlistIds.has(product.id)}
          />
        ))}
      </div>
      <div ref={sentinelRef} className="h-10" />
      {isLoading && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t.loadingMore}
        </p>
      )}
      {error && (
        <p className="mt-4 text-center text-sm text-red-500">
          {error}
        </p>
      )}
      {!hasMore && (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t.endOfList}
        </p>
      )}
    </>
  );
}
