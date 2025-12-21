import { ProductCard } from "@/components/product/product-card";

// Mock data - in real app, this would come from your database
const featuredProducts = [
  {
    id: "1",
    name: "Geometric Vase Collection",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
    category: "Home Decor",
    featured: true,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Custom Phone Stand",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=800&fit=crop",
    category: "Accessories",
    featured: true,
    rating: 4.6,
  },
  {
    id: "3",
    name: "Mechanical Keyboard Case",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&h=800&fit=crop",
    category: "Tech",
    featured: true,
    rating: 4.9,
  },
  {
    id: "4",
    name: "Artistic Sculpture Set",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=800&fit=crop",
    category: "Art",
    featured: true,
    rating: 4.7,
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 xl:py-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4">
            Featured Products
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Handpicked designs showcasing the best of 3D printing innovation
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}

