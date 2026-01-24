import { Navigation } from "@/components/navigation";
import { AboutHero } from "@/components/about/about-hero";
import { AboutStory } from "@/components/about/about-story";
import { WhyWorkWithUs } from "@/components/about/why-work-with-us";
import { WhatsComingNext } from "@/components/about/whats-coming-next";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <AboutHero />
        <AboutStory />
        <WhyWorkWithUs />
        <WhatsComingNext />
      </div>
    </main>
  );
}
