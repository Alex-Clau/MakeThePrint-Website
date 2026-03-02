"use client";

import { useEffect, useState } from "react";

export function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchCartCount() {
      try {
        const response = await fetch("/api/cart/count");
        if (!response.ok) {
          setCount(0);
          return;
        }
        const data = (await response.json()) as { count?: number };
        setCount(typeof data.count === "number" ? data.count : 0);
      } catch {
        setCount(0);
      }
    }

    fetchCartCount();

    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  return (
    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs flex items-center justify-center">
      {count > 99 ? "99+" : count}
    </span>
  );
}

