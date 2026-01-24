import { Suspense } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Gift } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/lib/supabase/products";
import { transformProductToCardData } from "@/lib/utils/products";
import { ProductCard } from "@/components/product/product-card";

async function SeasonalCollections() {
  // Get products marked as seasonal
  const products = await getProducts({ seasonal: true, limit: 12 });
  const transformedProducts = products.map(transformProductToCardData);

  return (
    <div className="space-y-8">
      {transformedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {transformedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No seasonal collections available yet</p>
        </div>
      )}
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <main className="min-h-screen flex flex-col relative z-10 bg-background">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-accent-primary-dark" />
            <h1 className="text-3xl sm:text-4xl font-bold text-accent-primary-dark">
              Seasonal Collections
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            Discover our exclusive holiday and seasonal collections. Limited edition designs
            perfect for gifting and special occasions.
          </p>
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
          <SeasonalCollections />
        </Suspense>
      </div>
    </main>
  );
}

