"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { AuthButtonClient } from "./auth-button-client";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { NavigationMobileMenu } from "./navigation-mobile-menu";
import { ShoppingCart } from "lucide-react";
import { CartCount } from "./navigation/cart-count";
import { useTranslations } from "./locale-provider";

export function Navigation() {
  const t = useTranslations();
  const n = t.nav;
  return (
    <nav className="w-full border-b border-accent-primary/20 bg-background backdrop-blur supports-[backdrop-filter]:bg-background sticky top-0 z-50 relative dark:border-border/50">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center h-14 sm:h-16 px-3 sm:px-4 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
          <Link href="/" className="font-bold text-base sm:text-lg lg:text-xl hover:text-accent-primary-dark">
            {n.brand}
          </Link>
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link
              href="/products"
              className="text-sm font-medium hover:text-accent-primary-dark transition-colors"
            >
              {n.customProducts}
            </Link>
            <Link
              href="/collections"
              className="text-sm font-medium hover:text-accent-primary-dark transition-colors"
            >
              {n.seasonalProducts}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-accent-primary-dark transition-colors"
            >
              {n.about}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-10 sm:w-10 touch-manipulation" asChild>
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 sm:h-5 sm:w-5" />
              <CartCount />
            </Link>
          </Button>
          <div className="hidden md:flex items-center gap-2 sm:gap-3 lg:gap-4">
            <LanguageSwitcher />
            <AuthButtonClient />
            <ThemeSwitcher />
          </div>
          <NavigationMobileMenu />
        </div>
      </div>
    </nav>
  );
}

