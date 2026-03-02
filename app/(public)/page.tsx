import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CustomPrintingSection } from "@/components/home/custom-printing-section";
import { messages } from "@/lib/messages";

export default async function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <HeroSection />
      <FeaturedProducts messages={messages} />
      <CustomPrintingSection />
    </main>
  );
}
