"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

export function NavigationMobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        className="md:hidden h-9 w-9"
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
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu */}
          <div className="md:hidden fixed inset-x-0 top-[56px] sm:top-[64px] bg-background border-b z-50 shadow-lg max-h-[calc(100vh-56px)] sm:max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="px-4 py-4 space-y-0">
              <Link
                href="/products"
                className="block py-3 text-base font-medium hover:text-primary transition-colors border-b border-border/40"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="block py-3 text-base font-medium hover:text-primary transition-colors border-b border-border/40"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="block py-3 text-base font-medium hover:text-primary transition-colors border-b border-border/40"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}

