import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Home Decor",
    slug: "home-decor",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop",
    description: "Transform your space with beautiful 3D printed home accessories",
    count: 12,
  },
  {
    name: "Tech Accessories",
    slug: "tech",
    image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&h=600&fit=crop",
    description: "Gadgets and accessories for your tech setup",
    count: 8,
  },
  {
    name: "Art & Sculptures",
    slug: "art",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop",
    description: "Creative expressions and artistic pieces",
    count: 15,
  },
  {
    name: "Tools & Parts",
    slug: "tools",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=600&fit=crop",
    description: "Functional solutions and replacement parts",
    count: 10,
  },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Shop by Category</h1>
          <p className="text-muted-foreground max-w-2xl">
            Explore our diverse range of 3D printed products organized by category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {category.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {category.count} products
                      </span>
                      <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                        Explore
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

