import { Suspense } from "react";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CustomPrintingSection } from "@/components/home/custom-printing-section";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <HeroSection />
      <Suspense
        fallback={
          <section className="py-8 sm:py-12 lg:py-16 xl:py-24">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <FeaturedProducts />
      </Suspense>
      <CustomPrintingSection />
    </main>
  );
}
