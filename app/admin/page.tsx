import { Suspense } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";

async function DashboardContent() {
  const supabase = await createClient();
  const locale = getLocaleFromCookie((await cookies()).get("locale")?.value);
  const a = getDictionary(locale).admin;

  // Check if user is authenticated and is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/?error=unauthorized");
  }

  // Fetch statistics
  const [productsCount, ordersCount, customProductsCount, seasonalProductsCount] =
    await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("product_type", "custom"),
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("product_type", "seasonal"),
    ]);

  const stats = [
    {
      title: a.totalProducts,
      value: productsCount.count || 0,
      icon: Package,
      description: a.allProductsInCatalog,
      href: "/admin/products",
    },
    {
      title: a.customProducts,
      value: customProductsCount.count || 0,
      icon: TrendingUp,
      description: a.wallLetteringKeychains,
      href: "/admin/products?type=custom",
    },
    {
      title: a.seasonalProducts,
      value: seasonalProductsCount.count || 0,
      icon: ShoppingCart,
      description: a.seasonalDecorItems,
      href: "/admin/products?type=seasonal",
    },
    {
      title: a.totalOrders,
      value: ordersCount.count || 0,
      icon: Users,
      description: a.customerOrders,
      href: "/account/orders",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{a.dashboardOverview}</h1>
          <p className="text-muted-foreground mt-1">
            {a.manageProducts}
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button size="lg">
            <Package className="mr-2 h-5 w-5" />
            {a.addNewProduct}
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-accent-primary-dark" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{a.customProducts}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {a.manageWallLettering}
            </p>
            <div className="flex gap-2">
              <Link href="/admin/products/new?type=custom">
                <Button variant="outline" size="sm">
                  {a.addCustomProduct}
                </Button>
              </Link>
              <Link href="/admin/products?type=custom">
                <Button variant="ghost" size="sm">
                  {a.viewAll}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{a.seasonalProducts}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {a.manageSeasonalDecor}
            </p>
            <div className="flex gap-2">
              <Link href="/admin/products/new?type=seasonal">
                <Button variant="outline" size="sm">
                  {a.addSeasonalProduct}
                </Button>
              </Link>
              <Link href="/admin/products?type=seasonal">
                <Button variant="ghost" size="sm">
                  {a.viewAll}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          {/* Header skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="h-9 w-64 bg-muted animate-pulse rounded" />
              <div className="h-5 w-96 bg-muted animate-pulse rounded mt-1" />
            </div>
            <div className="h-11 w-40 bg-muted animate-pulse rounded" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-muted animate-pulse rounded-lg" />
            <div className="h-48 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
