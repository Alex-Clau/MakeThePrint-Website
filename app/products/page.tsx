import { PageLayout } from "@/components/layout/page-layout";
import { ProductsContent } from "@/components/product/products-content";
import { getProducts } from "@/lib/supabase/products";
import { transformProductToCardData } from "@/lib/utils/products";
import { messages } from "@/lib/messages";

async function ProductsList() {
  const products = await getProducts({ product_type: "custom" });
  const transformedProducts = products.map((p) => transformProductToCardData(p));
  return <ProductsContent products={transformedProducts} />;
}

export default async function ProductsPage() {
  const t = messages.products;

  return (
    <PageLayout
      titleClassName="mb-0"
      title={
        <div className="mb-6 sm:mb-8 border-b border-accent-primary/30 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-accent-primary-dark">
                {t.title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t.subhead}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <ProductsList />
    </PageLayout>
  );
}

