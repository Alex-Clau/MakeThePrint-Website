import { Suspense } from "react";
import { Navigation } from "@/components/navigation";
import { ProductsContent } from "@/components/product/products-content";
import { getProducts } from "@/lib/supabase/products";
import { transformProductToCardData } from "@/lib/utils/products";

async function ProductsList() {
  // Get custom products (wall letters and keychains)
  const products = await getProducts({
    product_type: "custom"
  });
  const transformedProducts = products.map(transformProductToCardData);

  return <ProductsContent products={transformedProducts} />;
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 border-b border-accent-primary/30 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-accent-primary-dark">
                Custom Products
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Custom wall letters and keychains designed just for you
              </p>
            </div>
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
          <ProductsList />
        </Suspense>
      </div>
    </main>
  );
}

