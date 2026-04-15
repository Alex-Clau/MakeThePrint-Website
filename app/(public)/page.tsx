import { Suspense } from "react";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/home/hero-section";
import {
  FeaturedProducts,
  FeaturedProductsSkeleton,
} from "@/components/home/featured-products";
import { CustomPrintingSection } from "@/components/home/custom-printing-section";

export default async function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <HeroSection />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <CustomPrintingSection />
    </main>
  );
}
