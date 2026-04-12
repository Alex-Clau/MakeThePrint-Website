"use client";

import { useEffect, useState } from "react";

export function CartCount() {
  const [count, setCount] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function fetchCartCount() {
      try {
        const response = await fetch("/api/cart/count");
        if (!response.ok) {
          console.error("[CartCount] request failed", response.status);
          return;
        }
        const data = (await response.json()) as { count?: number };
        const next =
          typeof data.count === "number" ? data.count : undefined;
        if (next === undefined) {
          console.error("[CartCount] missing or invalid count in response");
          return;
        }
        setCount(next);
        setInitialized(true);
      } catch (error: unknown) {
        console.error("[CartCount]", error);
      }
    }

    void fetchCartCount();

    const handleCartUpdate = () => {
      void fetchCartCount();
    };
    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  if (!initialized || count === 0) {
    return null;
  }

  return (
    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs flex items-center justify-center">
      {count > 99 ? "99+" : count}
    </span>
  );
}
