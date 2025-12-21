import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Settings, Heart, MapPin } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/account/orders">
            <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Orders</p>
                    <p className="text-sm text-muted-foreground">View order history</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/account/wishlist">
            <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Wishlist</p>
                    <p className="text-sm text-muted-foreground">Saved items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/account/addresses">
            <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Addresses</p>
                    <p className="text-sm text-muted-foreground">Manage addresses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/account/settings">
            <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Settings</p>
                    <p className="text-sm text-muted-foreground">Account settings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">Order #12345</p>
                  <p className="text-sm text-muted-foreground">
                    Placed on January 15, 2024
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">$79.97</p>
                  <p className="text-sm text-muted-foreground">Shipped</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/account/orders/12345">View</Link>
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">Order #12344</p>
                  <p className="text-sm text-muted-foreground">
                    Placed on January 10, 2024
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">$29.99</p>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/account/orders/12344">View</Link>
                </Button>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/account/orders">View All Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

