import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/home/hero-section";
import { HomepageFeaturedProductsClient } from "@/components/home/homepage-featured-products-client";
import { CustomPrintingSection } from "@/components/home/custom-printing-section";

export default async function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <HeroSection />
      <HomepageFeaturedProductsClient />
      <CustomPrintingSection />
    </main>
  );
}
