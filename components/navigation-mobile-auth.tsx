"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User } from "lucide-react";
import { NavigationMobileAuthProps } from "@/types/navigation";

export function NavigationMobileAuth({ onLinkClick }: NavigationMobileAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <>
        <Link
          href="/auth/login"
          className="block py-3 text-base font-medium hover:text-accent-primary-dark transition-colors border-b border-border/40 touch-manipulation"
          onClick={onLinkClick}
        >
          Sign In
        </Link>
        <Link
          href="/auth/sign-up"
          className="block py-3 text-base font-medium hover:text-accent-primary-dark transition-colors border-b border-border/40 touch-manipulation"
          onClick={onLinkClick}
        >
          Sign Up
        </Link>
      </>
    );
  }

  return (
    <Link
      href="/account"
      className="flex items-center gap-2 py-3 text-base font-medium hover:text-accent-primary-dark transition-colors border-b border-border/40 touch-manipulation"
      onClick={onLinkClick}
    >
      <User className="h-4 w-4" />
      My Account
    </Link>
  );
}

