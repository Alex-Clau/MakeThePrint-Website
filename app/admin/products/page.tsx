import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminProductsList } from "@/components/admin/admin-products-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {requireAdmin} from "@/app/admin/actions";

interface AdminProductsPageProps {
  searchParams: Promise<{ type?: string; category?: string }>;
}

async function ProductsContent({ type, category }: { type?: string; category?: string }) {
  const supabase = await createClient();

  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  if (type) {
    query = query.eq("product_type", type);
  }
  if (category) {
    query = query.eq("category", category);
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

function FilterButtons({ type, category }: { type?: string; category?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/admin/products">
        <Button variant={!type && !category ? "default" : "outline"} size="sm">
          All
        </Button>
      </Link>
      <Link href="/admin/products?type=custom">
        <Button variant={type === "custom" ? "default" : "outline"} size="sm">
          Custom
        </Button>
      </Link>
      <Link href="/admin/products?type=seasonal">
        <Button variant={type === "seasonal" ? "default" : "outline"} size="sm">
          Seasonal
        </Button>
      </Link>
      <span className="inline-flex items-center text-muted-foreground px-1">|</span>
      <Link href={type ? `/admin/products?type=${type}&category=preset` : "/admin/products?category=preset"}>
        <Button variant={category === "preset" ? "default" : "outline"} size="sm">
          Preset
        </Button>
      </Link>
      <Link href={type ? `/admin/products?type=${type}&category=inquire` : "/admin/products?category=inquire"}>
        <Button variant={category === "inquire" ? "default" : "outline"} size="sm">
          Inquire
        </Button>
      </Link>
      <Link href={type ? `/admin/products?type=${type}&category=finished` : "/admin/products?category=finished"}>
        <Button variant={category === "finished" ? "default" : "outline"} size="sm">
          Finished
        </Button>
      </Link>
    </div>
  );
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const { type, category } = await searchParams;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button size="lg"><Plus className="mr-2 h-5 w-5" /> Add Product</Button>
        </Link>
      </header>

      <FilterButtons type={type} category={category} />

      <Suspense key={`${type}-${category}`} fallback={
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      }>
        <ProductsContent type={type} category={category} />
      </Suspense>
    </div>
  );
}
