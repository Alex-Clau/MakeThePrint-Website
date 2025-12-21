import Link from "next/link";
import { Button } from "./ui/button";
import { AuthButton } from "./auth-button";
import { ThemeSwitcher } from "./theme-switcher";
import { NavigationMobileMenu } from "./navigation-mobile-menu";
import { ShoppingCart } from "lucide-react";
import { Suspense } from "react";

export function Navigation() {
  return (
    <nav className="w-full border-b border-b-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 relative">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center h-14 sm:h-16 px-3 sm:px-4 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
          <Link href="/" className="font-bold text-base sm:text-lg lg:text-xl">
            Make The Print
          </Link>
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link
              href="/products"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" asChild>
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs flex items-center justify-center">
                0
              </span>
            </Link>
          </Button>
          <div className="hidden md:flex items-center gap-2 sm:gap-3 lg:gap-4">
            <Suspense>
              <AuthButton />
            </Suspense>
            <ThemeSwitcher />
          </div>
          <NavigationMobileMenu />
        </div>
      </div>
    </nav>
  );
}

