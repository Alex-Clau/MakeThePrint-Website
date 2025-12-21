import { Navigation } from "@/components/navigation";
import { ProductsContent } from "@/components/product/products-content";
import { mockProducts } from "@/lib/data/mock-products";

export default function ProductsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            All Products
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Discover our complete collection of 3D printed items
          </p>
        </div>

        <ProductsContent products={mockProducts} />
      </div>
    </main>
  );
}

