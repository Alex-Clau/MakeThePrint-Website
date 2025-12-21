import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const categories = [
  {
    name: "Home Decor",
    slug: "home-decor",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop",
    description: "Transform your space",
  },
  {
    name: "Tech Accessories",
    slug: "tech",
    image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&h=600&fit=crop",
    description: "Gadgets & accessories",
  },
  {
    name: "Art & Sculptures",
    slug: "art",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop",
    description: "Creative expressions",
  },
  {
    name: "Tools & Parts",
    slug: "tools",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=600&fit=crop",
    description: "Functional solutions",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 xl:py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4">
            Shop by Category
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground px-4">
            Explore our diverse range of 3D printed products
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                    Explore
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

