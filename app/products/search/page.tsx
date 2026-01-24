import { Suspense } from "react";
import { Navigation } from "@/components/navigation";
import { ProductsContent } from "@/components/product/products-content";
import { getProducts } from "@/lib/supabase/products";
import { transformProductToCardData } from "@/lib/utils/products";
import { ProductsPageSearch } from "@/components/product/products-page-search";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function SearchResults({ query }: { query: string }) {
  const products = await getProducts({ search: query });
  const transformedProducts = products.map(transformProductToCardData);

  return <ProductsContent products={transformedProducts} />;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const searchQuery = q || "";

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Search Products"}
          </h1>
          <div className="mt-4">
            <ProductsPageSearch />
          </div>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          }
        >
          {searchQuery ? (
            <SearchResults query={searchQuery} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Enter a search term to find products
              </p>
            </div>
          )}
        </Suspense>
      </div>
    </main>
  );
}

