"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";
import { Menu } from "lucide-react";
import { NavigationMobileAuth } from "./navigation-mobile-auth";
import { messages } from "@/lib/messages";

export function NavigationMobileMenu() {
  const [open, setOpen] = useState(false);
  const n = messages.nav;
  const f = messages.footer;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-10 w-10 touch-manipulation"
          aria-label={n.openMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" title={f.brand} className="w-[280px] sm:max-w-[280px] p-0 pt-4" showCloseButton>
        <div className="flex items-center px-4 pr-12">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            <Image
              src="/logoColor.png"
              alt={f.brand}
              width={200}
              height={67}
              className="object-contain h-12 w-auto"
              sizes="200px"
            />
          </Link>
        </div>
        <div className="flex flex-col px-4">
          <nav className="space-y-0">
            <Link
              href="/products"
              className="block py-3 text-base font-medium hover:text-accent-primary-dark transition-colors border-b border-border/40 touch-manipulation"
              onClick={() => setOpen(false)}
            >
              {n.customProducts}
            </Link>
            <Link
              href="/collections"
              className="block py-3 text-base font-medium hover:text-accent-primary-dark transition-colors border-b border-border/40 touch-manipulation"
              onClick={() => setOpen(false)}
            >
              {n.seasonalProducts}
            </Link>
            <Link
              href="/about"
              className="block py-3 text-base font-medium hover:text-accent-primary-dark transition-colors border-b border-border/40 touch-manipulation"
              onClick={() => setOpen(false)}
            >
              {n.about}
            </Link>
            <div className="border-t border-border/40 mt-2 pt-2">
              <NavigationMobileAuth onLinkClick={() => setOpen(false)} />
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
