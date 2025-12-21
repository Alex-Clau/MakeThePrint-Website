import { ProductCard } from "@/components/product/product-card";
import { ProductCardData } from "@/types/product";

interface CategoryContentProps {
  slug: string;
  products: ProductCardData[];
  categoryName: string;
}

export function CategoryContent({
  slug,
  products,
  categoryName,
}: CategoryContentProps) {
  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">{categoryName}</h1>
      <p className="text-muted-foreground">
        Explore our collection of {categoryName.toLowerCase()} products
      </p>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No products found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </>
  );
}

