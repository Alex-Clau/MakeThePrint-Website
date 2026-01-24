import { Card, CardContent } from "@/components/ui/card";
import { Package, Settings, Heart, MapPin } from "lucide-react";
import Link from "next/link";

export function AccountMenu() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Link href="/account/orders">
        <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm sm:text-base">Orders</p>
                <p className="text-xs sm:text-sm text-muted-foreground">View order history</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link href="/account/wishlist">
        <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm sm:text-base">Wishlist</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Saved items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link href="/account/addresses">
        <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm sm:text-base">Addresses</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Manage addresses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link href="/account/settings">
        <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm sm:text-base">Settings</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Account settings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

