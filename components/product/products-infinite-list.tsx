"use client";

import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import type { ProductCardData } from "@/types/product";
import { messages } from "@/lib/messages";
import { fetchWishlistProductIdsFromApi } from "@/lib/supabase/wishlist-client";
import { getApiErrorBody } from "@/lib/utils/api-error";
import { WISHLIST_UPDATED_EVENT } from "@/lib/wishlist/events";
import { useInfiniteScrollList } from "@/lib/hooks/use-infinite-scroll-list";

type ProductsInfiniteListProps = {
  initialProducts: ProductCardData[];
  initialPage: number;
  pageSize: number;
  initialHasMore: boolean;
  search?: string;
  apiPath?: string;
  emptyLabel?: string;
  loadingLabel?: string;
  endOfListLabel?: string;
  loadMoreFailedLabel?: string;
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
  search,
  apiPath = "/api/products/catalog",
  emptyLabel,
  loadingLabel,
  endOfListLabel,
  loadMoreFailedLabel,
}: ProductsInfiniteListProps) {
  const t = messages.products;
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  const refreshWishlistIds = useCallback(() => {
    void fetchWishlistProductIdsFromApi().then((result) => {
      if (result.ok) {
        setWishlistIds(new Set(result.productIds));
      }
    });
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    void fetchWishlistProductIdsFromApi({ signal: ac.signal }).then((result) => {
      if (result.ok) {
        setWishlistIds(new Set(result.productIds));
      }
    });
    return () => ac.abort();
  }, []);

  useEffect(() => {
    window.addEventListener(WISHLIST_UPDATED_EVENT, refreshWishlistIds);
    return () => window.removeEventListener(WISHLIST_UPDATED_EVENT, refreshWishlistIds);
  }, [refreshWishlistIds]);

  const loadPage = useCallback(
    async (page: number) => {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
      });
      if (search) {
        params.set("search", search);
      }
      const res = await fetch(`${apiPath}?${params.toString()}`);
      if (!res.ok) {
        const { message } = await getApiErrorBody(res);
        throw new Error(message);
      }
      const body = (await res.json()) as CatalogApiResponse;
      return { items: body.products, hasMore: body.hasMore };
    },
    [apiPath, pageSize, search]
  );

  const { items: products, hasMore, isLoading, error, sentinelRef } =
    useInfiniteScrollList<ProductCardData>({
      initialItems: initialProducts,
      initialPage,
      initialHasMore,
      resetKey: `${search ?? ""}|${apiPath}`,
      loadPage,
      defaultError: loadMoreFailedLabel ?? t.loadMoreFailed,
    });

  return (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              isInWishlist={product.isInWishlist ?? wishlistIds.has(product.id)}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted-foreground">{emptyLabel ?? t.noProducts}</p>
      )}
      <div ref={sentinelRef} className="h-10" />
      {isLoading && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {loadingLabel ?? t.loadingMore}
        </p>
      )}
      {error && (
        <p className="mt-4 text-center text-sm text-red-500">
          {error}
        </p>
      )}
      {!hasMore && products.length > 0 && (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {endOfListLabel ?? t.endOfList}
        </p>
      )}
    </>
  );
}
