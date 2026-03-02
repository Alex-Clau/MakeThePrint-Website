import { PageLayout } from "@/components/layout/page-layout";
import { AboutHero } from "@/components/about/about-hero";
import { AboutStory } from "@/components/about/about-story";
import { WhyWorkWithUs } from "@/components/about/why-work-with-us";
import { WhatsComingNext } from "@/components/about/whats-coming-next";

export default function AboutPage() {
  return (
    <PageLayout maxWidth="4xl" padding="relaxed" contentClassName="py-8 sm:py-12 lg:py-16">
      <AboutHero />
      <AboutStory />
      <WhyWorkWithUs />
      <WhatsComingNext />
    </PageLayout>
  );
}
