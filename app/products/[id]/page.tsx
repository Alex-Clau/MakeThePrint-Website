import { Navigation } from "@/components/navigation";
import { AnimatedProductPageContent } from "@/components/product/animated-product-page-content";
import { ProductWithImage } from "@/types/product";
import { ProductPageParams } from "@/types/pages";

// Mock data - in real app, this would come from your database
const product: ProductWithImage = {
  id: "1",
  name: "Geometric Vase Collection",
  description:
    "A stunning collection of geometric vases that combine modern design with functional elegance. Each piece is carefully 3D printed using premium materials to ensure durability and aesthetic appeal.",
  price: 29.99,
  material_options: ["PLA", "ABS", "PETG", "TPU"],
  stock_quantity: 15,
  dimensions: "15cm x 15cm x 20cm",
  print_time_hours: 4.5,
  weight_grams: 250,
  rating: 4.8,
  review_count: 24,
  image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
};

export default function ProductDetailPage({ params }: ProductPageParams) {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-12">
        <AnimatedProductPageContent product={product} />
      </div>
    </main>
  );
}
