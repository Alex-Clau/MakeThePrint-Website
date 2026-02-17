"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslations } from "@/components/locale-provider";

export function HeroSection() {
  const t = useTranslations();
  const h = t.home;
  const c = t.common;
  return (
    <section className="relative w-full overflow-hidden min-h-[700px] lg:h-[850px] flex items-center">
      {/* Background: light theme = heroWhite, dark theme = heroBlack */}
      <div className="hidden md:block absolute inset-0">
        <Image
          src="/heroWhite.png"
          alt="3D Printers"
          fill
          priority
          quality={75}
          className="object-center dark:hidden"
          sizes="100vw"
          unoptimized
        />
        <Image
          src="/heroBlack.png"
          alt="3D Printers"
          fill
          priority
          quality={75}
          className="object-center hidden dark:block"
          sizes="100vw"
          unoptimized
        />
        {/* Overlays: stronger center wash for text, gradient to blend with theme */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,hsl(var(--background)/0.72),transparent)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background"
          aria-hidden
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 w-full">
        <div className="text-center flex flex-col justify-around min-h-[calc(100vh-3.5rem)] sm:min-h-0 sm:justify-center sm:items-center lg:block">
          <div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-accent-primary-dark" />
              <span className="text-sm font-medium text-accent-primary-dark uppercase tracking-wide">
                {h.badge}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 text-hero-title">
              {h.headline}
              <span className="block bg-gradient-to-r from-accent-primary-dark to-accent-primary bg-clip-text text-transparent">
                {h.headlineHighlight}
              </span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-hero-subhead font-medium max-w-2xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
              {h.subhead}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-2 justify-center items-center px-8 sm:px-0">
            <Button size="lg" className="bg-accent-primary-dark hover:bg-accent-primary-dark/90 text-white w-full sm:w-auto max-w-xs sm:max-w-none" asChild>
              <Link href="/products">
                {c.shopNow}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-accent-primary-light/10 hover:bg-accent-primary-light/25 border-accent-primary-light/70 text-hero-subhead hover:text-hero-title w-full sm:w-auto max-w-xs sm:max-w-none font-medium"
              asChild
            >
              <Link href="/about">{c.learnMore}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}