import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AboutHero() {
  return (
    <div className="text-center mb-12 sm:mb-16">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
        Hey, welcome.
      </h1>
      <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2">
        I'm MakeThePrint.
      </p>
      <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        My dad and I started this because we love beautiful prints. Now we're
        here to share that with you.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/products">Explore Our Products</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="#story">Our Story</Link>
        </Button>
      </div>
    </div>
  );
}

