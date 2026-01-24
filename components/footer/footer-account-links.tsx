"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function FooterAccountLinks() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (error: any) {
        // Silently fail - auth check failures are non-critical
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();

    // Listen for auth changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <h4 className="font-semibold mb-4">Account</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {!isLoading && !isAuthenticated && (
          <li>
            <a href="/auth/login" className="hover:text-accent-primary-dark transition-colors">
              Sign In
            </a>
          </li>
        )}
        <li>
          <a href="/account" className="hover:text-accent-primary-dark transition-colors">
            My Account
          </a>
        </li>
        <li>
          <a href="/account/orders" className="hover:text-accent-primary-dark transition-colors">
            Order History
          </a>
        </li>
      </ul>
    </div>
  );
}

