"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { NavigationMobileAuthProps } from "@/types/navigation";
import { LogoutButton } from "./logout-button";
import { messages } from "@/lib/messages";
import { useSupabaseUser } from "@/lib/supabase/use-supabase-user";

export function NavigationMobileAuth({ onLinkClick }: NavigationMobileAuthProps) {
  const a = messages.auth;
  const c = messages.common;
  const { user, isLoading } = useSupabaseUser();

  if (isLoading) return null;

  if (!user) {
    return (
      <>
        <Link
          href="/auth/login"
          className="block py-3 text-base font-medium hover:text-accent-primary-dark transition-colors border-b border-border/40 touch-manipulation"
          onClick={onLinkClick}
        >
          {a.signIn}
        </Link>
        <Link
          href="/auth/sign-up"
          className="block py-3 text-base font-medium hover:text-accent-primary-dark transition-colors border-b border-border/40 touch-manipulation"
          onClick={onLinkClick}
        >
          {a.signUp}
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href="/account"
        className="flex items-center gap-2 py-3 text-base font-medium hover:text-accent-primary-dark transition-colors border-b border-border/40 touch-manipulation"
        onClick={onLinkClick}
      >
        <User className="h-4 w-4" />
        <span>{c.myAccount}</span>
      </Link>
      <div className="py-3 border-b border-border/40">
        <LogoutButton />
      </div>
    </>
  );
}
