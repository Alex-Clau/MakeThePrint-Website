import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminProductsList } from "@/components/admin/admin-products-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

interface AdminProductsPageProps {
  searchParams: Promise<{ type?: string }>;
}

async function ProductsContent({ type }: { type?: string }) {
  const supabase = await createClient();

  // Check if user is authenticated and is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/admin/products");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/?error=unauthorized");
  }

  // Build query based on filters
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  if (type) {
    query = query.eq("product_type", type);
  }

  const { data: products, error } = await query;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading products: {error.message}</p>
      </div>
    );
  }

  return <AdminProductsList products={products || []} />;
}

async function ProductsWrapper({ searchParams }: AdminProductsPageProps) {
  const { type } = await searchParams;
  return <ProductsContent type={type} />;
}

function FilterButtons({ type }: { type?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/admin/products">
        <Button
          variant={!type ? "default" : "outline"}
          size="sm"
        >
          All Products
        </Button>
      </Link>
      <Link href="/admin/products?type=custom">
        <Button
          variant={type === "custom" ? "default" : "outline"}
          size="sm"
        >
          Custom Products
        </Button>
      </Link>
      <Link href="/admin/products?type=seasonal">
        <Button
          variant={type === "seasonal" ? "default" : "outline"}
          size="sm"
        >
          Seasonal
        </Button>
      </Link>
    </div>
  );
}

async function FilterButtonsWrapper({ searchParams }: AdminProductsPageProps) {
  const { type } = await searchParams;
  return <FilterButtons type={type} />;
}

export default function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Suspense fallback={<div className="h-9 w-96 bg-muted animate-pulse rounded" />}>
        <FilterButtonsWrapper searchParams={searchParams} />
      </Suspense>

      {/* Products List */}
      <Suspense
        fallback={
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        }
      >
        <ProductsWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
