"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "@/components/locale-provider";

export function AuthButtonClient() {
  const c = useTranslations().common;
  const a = useTranslations().auth;
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        setUser(authUser);
      } catch (error: any) {
        // Silently fail - auth check failures are non-critical
        setUser(null);
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
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex gap-2">
        <div className="h-9 w-16 bg-muted animate-pulse rounded" />
        <div className="h-9 w-16 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-2 sm:gap-3">
      <Button asChild size="sm" variant="ghost" className="flex items-center gap-2">
        <Link href="/account">
          <User className="h-4 w-4" />
          <span className="sm:hidden">{c.myAccount}</span>
        </Link>
      </Button>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">{a.signIn}</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">{a.signUp}</Link>
      </Button>
    </div>
  );
}

