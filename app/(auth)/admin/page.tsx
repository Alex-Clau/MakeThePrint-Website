import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { messages } from "@/lib/messages";
import { getDashboardStats } from "@/lib/supabase/admin";

async function DashboardContent() {
  const a = messages.admin;
  const {
    productsCount,
    ordersCount,
    customProductsCount,
    seasonalProductsCount,
  } = await getDashboardStats();

  const stats = [
    {
      title: a.totalProducts,
      value: productsCount,
      icon: Package,
      description: a.allProductsInCatalog,
      href: "/admin/products",
    },
    {
      title: a.customProducts,
      value: customProductsCount,
      icon: TrendingUp,
      description: a.customProducts,
      href: "/admin/products?type=custom",
    },
    {
      title: a.seasonalProducts,
      value: seasonalProductsCount,
      icon: ShoppingCart,
      description: a.seasonalDecorItems,
      href: "/admin/products?type=seasonal",
    },
    {
      title: a.totalOrders,
      value: ordersCount,
      icon: Users,
      description: a.customerOrders,
      href: "/admin/orders",
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
            <Package className="mr-2 h-5 w-5"/>
            {a.addNewProduct}
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-accent-primary-dark"/>
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
      <Card>
        <CardHeader>
          <CardTitle>{a.customProducts}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {a.manageProducts}
          </p>
          <div className="flex gap-2">
            <Link href="/admin/products/new?type=custom">
              <Button
                variant="outline"
                size="sm"
              >
                {a.addProduct}
              </Button>
            </Link>
            <Link href="/admin/products?type=custom">
              <Button
                variant="ghost"
                size="sm"
              >
                {a.viewAll}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  return <DashboardContent />;
}
