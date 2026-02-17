import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react";
import { requireAdmin } from "@/app/admin/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation */}
      <nav className="border-b border-accent-primary/20 bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="font-bold text-xl text-accent-primary-dark">
                Admin Dashboard
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-sm font-medium hover:text-accent-primary-dark transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Overview
                </Link>
                <Link
                  href="/admin/products"
                  className="flex items-center gap-2 text-sm font-medium hover:text-accent-primary-dark transition-colors"
                >
                  <Package className="h-4 w-4" />
                  Products
                </Link>
                <Link
                  href="/admin/orders"
                  className="flex items-center gap-2 text-sm font-medium hover:text-accent-primary-dark transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Orders
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  View Site
                </Button>
              </Link>
              <form action="/auth/sign-out" method="post">
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
