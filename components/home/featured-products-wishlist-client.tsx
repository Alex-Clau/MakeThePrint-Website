"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { fetchWishlistProductIdsFromApi } from "@/lib/supabase/wishlist-client";
import type { ProductCardData } from "@/types/product";
import { WISHLIST_UPDATED_EVENT } from "@/lib/wishlist/events";
import { messages } from "@/lib/messages";

type Props = {
  cards: ProductCardData[];
  wishlistProductIds: string[];
};

function stepForScroller(el: HTMLDivElement): number {
  const first = el.children[0] as HTMLElement | undefined;
  if (!first) return el.clientWidth;
  const second = el.children[1] as HTMLElement | undefined;
  if (second) {
    return second.offsetLeft - first.offsetLeft;
  }
  return first.getBoundingClientRect().width;
}

function indexFromScrollLeft(el: HTMLDivElement, count: number): number {
  if (count <= 0) return 0;
  const step = stepForScroller(el);
  if (step <= 0) return 0;
  const i = Math.round(el.scrollLeft / step);
  return Math.max(0, Math.min(i, count - 1));
}

export function FeaturedProductsWishlistClient({ cards, wishlistProductIds }: Props) {
  const [wishlistIds, setWishlistIds] = useState(() => new Set(wishlistProductIds));
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const h = messages.home;

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

  const syncIndexFromScrollPosition = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || cards.length === 0) return;
    setIndex(indexFromScrollLeft(el, cards.length));
  }, [cards.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || cards.length === 0) return;

    const clearTimer = () => {
      if (settleTimerRef.current != null) {
        clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
    };

    const settle = () => {
      clearTimer();
      syncIndexFromScrollPosition();
    };

    const onScrollEnd = () => settle();

    const onScroll = () => {
      clearTimer();
      settleTimerRef.current = setTimeout(settle, 140);
    };

    el.addEventListener("scrollend", onScrollEnd);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scrollend", onScrollEnd);
      el.removeEventListener("scroll", onScroll);
      clearTimer();
    };
  }, [cards.length, syncIndexFromScrollPosition]);

  const scrollToCard = useCallback(
    (i: number) => {
      const el = scrollerRef.current;
      if (!el || cards.length === 0) return;
      const next = Math.max(0, Math.min(i, cards.length - 1));
      const child = el.children[next] as HTMLElement | undefined;
      setIndex(next);
      if (child) {
        child.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      }
    },
    [cards.length]
  );

  if (cards.length === 0) return null;

  return (
    <>
      <div className="flex flex-col items-center sm:hidden px-11">
        <div className="relative w-[min(22rem,calc(100vw-5.5rem))] max-w-md">
          <div
            ref={scrollerRef}
            className="w-full overflow-x-auto flex flex-nowrap gap-0 snap-x snap-mandatory pb-2 scrollbar-hide scroll-smooth touch-pan-x"
            aria-label={h.featuredTitle}
          >
            {cards.map((product) => (
              <div
                key={product.id}
                data-feature-card
                className="min-w-full shrink-0 snap-center snap-always box-border px-0.5"
              >
                <ProductCard {...product} isInWishlist={wishlistIds.has(product.id)} />
              </div>
            ))}
          </div>
          {cards.length > 1 && (
            <>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute -left-1 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full border-accent-primary/40 bg-background/90 shadow-sm"
                onClick={() => scrollToCard(index - 1)}
                disabled={index <= 0}
                aria-label={h.featuredCarouselPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute -right-1 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full border-accent-primary/40 bg-background/90 shadow-sm"
                onClick={() => scrollToCard(index + 1)}
                disabled={index >= cards.length - 1}
                aria-label={h.featuredCarouselNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        {cards.length > 1 && (
          <div className="mt-3 flex justify-center gap-2" role="tablist" aria-label={h.featuredTitle}>
            {cards.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  i === index ? "bg-accent-primary-dark" : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
                }`}
                aria-label={h.featuredCarouselGoTo.replace("{n}", String(i + 1))}
                onClick={() => scrollToCard(i)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
        {cards.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            isInWishlist={wishlistIds.has(product.id)}
          />
        ))}
      </div>
    </>
  );
}
