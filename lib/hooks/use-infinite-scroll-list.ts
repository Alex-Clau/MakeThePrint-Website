"use client";

import { useEffect, useRef, useState } from "react";

type InfinitePageResult<TItem> = {
  items: TItem[];
  hasMore: boolean;
};

type UseInfiniteScrollListOptions<TItem> = {
  initialItems: TItem[];
  initialPage: number;
  initialHasMore: boolean;
  resetKey: string;
  loadPage: (page: number) => Promise<InfinitePageResult<TItem>>;
  defaultError: string;
};

export function useInfiniteScrollList<TItem>({
  initialItems,
  initialPage,
  initialHasMore,
  resetKey,
  loadPage,
  defaultError,
}: UseInfiniteScrollListOptions<TItem>) {
  const [items, setItems] = useState<TItem[]>(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(initialPage);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(initialHasMore);

  useEffect(() => {
    setItems(initialItems);
    pageRef.current = initialPage;
    hasMoreRef.current = initialHasMore;
    setHasMore(initialHasMore);
    setError(null);
  }, [initialItems, initialPage, initialHasMore, resetKey]);

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
          const { items: nextItems, hasMore: nextHasMore } = await loadPage(nextPage);
          if (cancelled) return;

          setItems((prev) => [...prev, ...nextItems]);
          pageRef.current = nextPage;
          hasMoreRef.current = nextHasMore;
          setHasMore(nextHasMore);
        } catch (e) {
          if (!cancelled) {
            setError(e instanceof Error ? e.message : defaultError);
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
  }, [defaultError, loadPage]);

  return {
    items,
    setItems,
    hasMore,
    isLoading,
    error,
    sentinelRef,
  };
}
