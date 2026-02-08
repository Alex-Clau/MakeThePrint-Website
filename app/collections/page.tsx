import { Suspense } from "react";
import { cookies } from "next/headers";
import { Navigation } from "@/components/navigation";
import { Sparkles, Gift } from "lucide-react";
import { getProducts } from "@/lib/supabase/products";
import { transformProductToCardData } from "@/lib/utils/products";
import { ProductCard } from "@/components/product/product-card";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";
import type { Messages } from "@/lib/i18n";

async function SeasonalCollections({ messages }: { messages: Messages }) {
  const products = await getProducts({ seasonal: true, limit: 12 });
  const transformedProducts = products.map(transformProductToCardData);
  const t = messages.collections;

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
          <p className="text-muted-foreground">{t.noSeasonal}</p>
        </div>
      )}
    </div>
  );
}

export default async function CollectionsPage() {
  const locale = getLocaleFromCookie((await cookies()).get("locale")?.value);
  const messages = getDictionary(locale);
  const t = messages.collections;

  return (
    <main className="min-h-screen flex flex-col relative z-10 bg-background">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-accent-primary-dark" />
            <h1 className="text-3xl sm:text-4xl font-bold text-accent-primary-dark">
              {t.title}
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            {t.subhead}
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
          <SeasonalCollections messages={messages} />
        </Suspense>
      </div>
    </main>
  );
}

