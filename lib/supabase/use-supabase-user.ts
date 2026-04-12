"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

/**
 * Subscribes to Supabase auth for the browser client. Single place for
 * getUser + onAuthStateChange so nav/footer/mobile stay in sync.
 */
export function useSupabaseUser(): {
  user: User | null;
  isLoading: boolean;
} {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function initial() {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        setUser(authUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void initial();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading };
}
