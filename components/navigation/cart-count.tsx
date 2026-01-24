"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function CartCount() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCartCount() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setCount(0);
          setIsLoading(false);
          return;
        }

        const { count: cartCount } = await supabase
          .from("cart")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        setCount(cartCount || 0);
      } catch (error: any) {
        // Silently fail - cart count failures are non-critical
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCartCount();

    // Set up real-time subscription for cart changes
    const supabase = createClient();
    const channel = supabase
      .channel("cart-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart",
        },
        () => {
          fetchCartCount();
        }
      )
      .subscribe();

    // Listen for custom cart update events
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  if (isLoading) {
    return (
      <span className="absolute -top-1 -right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs flex items-center justify-center">
        0
      </span>
    );
  }

  return (
    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs flex items-center justify-center">
      {count > 99 ? "99+" : count}
    </span>
  );
}

