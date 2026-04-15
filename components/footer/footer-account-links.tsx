"use client";

import Link from "next/link";
import { messages } from "@/lib/messages";
import { useSupabaseUser } from "@/lib/supabase/use-supabase-user";

export function FooterAccountLinks() {
  const c = messages.common;
  const { user, isLoading } = useSupabaseUser();
  const isAuthenticated = !!user;

  return (
    <div>
      <h4 className="font-semibold mb-4">{c.account}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {!isLoading && !isAuthenticated && (
          <li>
            <Link href="/auth/login" className="hover:text-accent-primary-dark transition-colors">
              {c.signIn}
            </Link>
          </li>
        )}
        <li>
          <Link href="/account" className="hover:text-accent-primary-dark transition-colors">
            {c.myAccount}
          </Link>
        </li>
        <li>
          <Link href="/account/orders" className="hover:text-accent-primary-dark transition-colors">
            {c.orderHistory}
          </Link>
        </li>
      </ul>
    </div>
  );
}
