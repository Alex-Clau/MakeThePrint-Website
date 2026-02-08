import { FooterAccountLinks } from "./footer-account-links";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full border-t border-accent-primary/30 mt-6 sm:mt-16 lg:mt-24 bg-accent-primary-light/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-accent-primary-dark">Make The Print</h3>
            <p className="text-sm text-muted-foreground">
              Premium 3D printed products for your home, office, and creative
              projects.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-accent-primary-dark transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent-primary-dark transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/faq" className="hover:text-accent-primary-dark transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-accent-primary-dark transition-colors">
                  Shipping
                </Link>
              </li>
            </ul>
          </div>
          <FooterAccountLinks />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 sm:pt-8 border-t border-accent-primary/30">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © 2024 Make The Print. All rights reserved.
          </p>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}

