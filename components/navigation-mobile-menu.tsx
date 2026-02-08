"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { NavigationMobileAuth } from "./navigation-mobile-auth";
import { useTranslations } from "./locale-provider";

export function NavigationMobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const n = useTranslations().nav;
  const closeMenu = () => setMobileMenuOpen(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden h-10 w-10 touch-manipulation"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40 top-[56px] sm:top-[64px]"
            onClick={closeMenu}
          />
          {/* Menu */}
          <div className="md:hidden fixed inset-x-0 top-[56px] sm:top-[64px] bg-background border-b z-50 shadow-lg max-h-[calc(100vh-56px)] sm:max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="px-4 py-4 space-y-0">
              <Link
                href="/products"
                className="block py-3 text-base font-medium hover:text-accent-primary-dark transition-colors border-b border-border/40 touch-manipulation"
                onClick={closeMenu}
              >
                {n.customProducts}
              </Link>
              <Link
                href="/collections"
                className="block py-3 text-base font-medium hover:text-accent-primary-dark transition-colors border-b border-border/40 touch-manipulation"
                onClick={closeMenu}
              >
                {n.seasonalProducts}
              </Link>
              <Link
                href="/about"
                className="block py-3 text-base font-medium hover:text-accent-primary-dark transition-colors border-b border-border/40 touch-manipulation"
                onClick={closeMenu}
              >
                {n.about}
              </Link>
              <div className="border-t border-border/40 mt-2 pt-2">
                <NavigationMobileAuth onLinkClick={closeMenu} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

