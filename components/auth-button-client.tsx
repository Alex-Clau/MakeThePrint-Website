"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";
import { User } from "lucide-react";
import { messages } from "@/lib/messages";
import { Skeleton } from "@/components/ui/skeleton";
import { useSupabaseUser } from "@/lib/supabase/use-supabase-user";

export function AuthButtonClient() {
  const c = messages.common;
  const a = messages.auth;
  const { user, isLoading } = useSupabaseUser();

  if (isLoading) {
    return (
      <div className="flex gap-2">
        <Skeleton className="h-9 w-16 rounded" />
        <Skeleton className="h-9 w-16 rounded" />
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
      <Button asChild size="sm" variant="outline">
        <Link href="/auth/login">{a.signIn}</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/auth/sign-up">{a.signUp}</Link>
      </Button>
    </div>
  );
}
