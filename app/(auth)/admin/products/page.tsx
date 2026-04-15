import { Suspense } from "react";
import { getAdminProductsPage } from "@/lib/supabase/products";
import { AdminProductsList } from "@/components/admin/admin-products-list";
import { AdminProductsFilters } from "@/components/admin/admin-products-filters";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { AdminProductsPageProps } from "@/types/admin";
import type { Product } from "@/types/product";
import { messages } from "@/lib/messages";

const ADMIN_PRODUCTS_PAGE_SIZE = 12;

async function ProductsContent({
  type,
  category,
  search,
}: {
  type?: string;
  category?: string;
  search?: string;
}) {
  try {
    const { products, hasMore }: { products: Product[]; hasMore: boolean } =
      await getAdminProductsPage({
        page: 1,
        pageSize: ADMIN_PRODUCTS_PAGE_SIZE,
        ...(type ? { type } : {}),
        ...(category ? { category } : {}),
        ...(search ? { search } : {}),
      });
    return (
      <AdminProductsList
        key={`${type || "all"}-${category || "all"}-${search || ""}`}
        initialProducts={products}
        initialPage={1}
        pageSize={ADMIN_PRODUCTS_PAGE_SIZE}
        initialHasMore={hasMore}
        type={type}
        category={category}
        search={search}
      />
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load products";
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">Error loading products: {message}</p>
      </div>
    );
  }
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const { type, category, search } = await searchParams;
  const a = messages.admin;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 pr-2 sm:pr-4">
          <h1 className="text-2xl font-bold sm:text-3xl">{a.productsCatalogTitle}</h1>
          <p className="text-sm text-muted-foreground sm:text-base">{a.productsCatalogSubhead}</p>
        </div>
        <Link href="/admin/products/new" className="shrink-0 self-stretch sm:self-auto sm:ml-4">
          <Button size="sm" className="h-10 w-full px-4 text-sm sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            {a.addNewProduct}
          </Button>
        </Link>
      </header>

      <Suspense fallback={null}>
        <AdminProductsFilters />
      </Suspense>

      <ProductsContent type={type} category={category} search={search} />
    </div>
  );
}