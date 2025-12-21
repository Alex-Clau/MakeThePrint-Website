import { Suspense } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProductCardData } from "@/types/product";
import { CategoryPageParams } from "@/types/pages";
import { CategoryContent } from "@/components/category/category-content";

// Mock data - in real app, this would come from your database
const categoryProducts: Record<string, ProductCardData[]> = {
  "home-decor": [
    {
      id: "1",
      name: "Geometric Vase Collection",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
      category: "Home Decor",
      rating: 4.8,
    },
    {
      id: "5",
      name: "Desk Organizer Pro",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop",
      category: "Home Decor",
      rating: 4.5,
    },
  ],
  tech: [
    {
      id: "3",
      name: "Mechanical Keyboard Case",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&h=800&fit=crop",
      category: "Tech",
      rating: 4.9,
    },
    {
      id: "6",
      name: "Laptop Stand Adjustable",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&h=800&fit=crop",
      category: "Tech",
      rating: 4.8,
    },
  ],
  art: [
    {
      id: "4",
      name: "Artistic Sculpture Set",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=800&fit=crop",
      category: "Art",
      rating: 4.7,
    },
    {
      id: "7",
      name: "Wall Art Collection",
      price: 44.99,
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=800&fit=crop",
      category: "Art",
      rating: 4.6,
    },
  ],
  tools: [
    {
      id: "8",
      name: "Custom Tool Holder",
      price: 27.99,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=800&fit=crop",
      category: "Tools",
      rating: 4.7,
    },
  ],
};

const categoryNames: Record<string, string> = {
  "home-decor": "Home Decor",
  tech: "Tech Accessories",
  art: "Art & Sculptures",
  tools: "Tools & Parts",
};

async function CategoryContentWrapper({ params }: CategoryPageParams) {
  const { slug } = await params;
  const products = categoryProducts[slug as keyof typeof categoryProducts] || [];
  const categoryName = categoryNames[slug] || slug;

  return <CategoryContent slug={slug} products={products} categoryName={categoryName} />;
}

export default function CategoryPage({ params }: CategoryPageParams) {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Suspense
            fallback={
              <div>
                <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-64 bg-muted animate-pulse rounded" />
              </div>
            }
          >
            <CategoryContentWrapper params={params} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

