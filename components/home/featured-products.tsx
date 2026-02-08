import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/supabase/products";
import { transformProductToCardData } from "@/lib/utils/products";
import type { Messages } from "@/lib/i18n";

export async function FeaturedProducts({ messages }: { messages: Messages }) {
  const products = await getProducts({ featured: true, limit: 4 });
  const transformedProducts = products.map(transformProductToCardData);
  const t = messages.home;

  return (
    <section className="py-8 sm:py-12 lg:py-16 xl:py-24 border-b border-accent-primary/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4 text-accent-primary-dark">
            {t.featuredTitle}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            {t.featuredSubhead}
          </p>
        </div>
        {transformedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {transformedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">{t.noFeatured}</p>
        )}
      </div>
    </section>
  );
}

