import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden min-h-[700px] lg:h-[850px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-backdrop.png"
          alt="3D Printers"
          fill
          priority
          quality={75}
          className="object-contain object-top"
          sizes="100vw"
          unoptimized
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/60" />
      </div>
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 w-full">
        <div className="text-center flex flex-col justify-around min-h-[calc(100vh-3.5rem)] sm:min-h-0 sm:justify-center sm:items-center lg:block">
          <div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-accent-primary-dark" />
              <span className="text-sm font-medium text-accent-primary-dark uppercase tracking-wide">
                Premium 3D Printed Products
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6">
              Bring Your Ideas to
              <span className="block bg-gradient-to-r from-accent-primary-dark to-accent-primary bg-clip-text text-transparent">
                Life in 3D
              </span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
              Discover our collection of high-quality 3D printed items.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-2 justify-center items-center px-8 sm:px-0">
            <Button size="lg" className="bg-accent-primary-dark hover:bg-accent-primary-dark/90 text-white w-full sm:w-auto max-w-xs sm:max-w-none" asChild>
              <Link href="/products">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-accent-secondary-light/10 hover:bg-accent-secondary/20 border-accent-secondary-dark/30 text-accent-secondary hover:text-accent-secondary w-full sm:w-auto max-w-xs sm:max-w-none"
              asChild
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

