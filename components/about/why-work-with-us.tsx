import { Card, CardContent } from "@/components/ui/card";
import { Package, Heart, Zap, TrendingUp } from "lucide-react";

export function WhyWorkWithUs() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Why Work With Us
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-6">
            <Package className="h-10 w-10 mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">Quality Prints</h3>
            <p className="text-sm text-muted-foreground">
              We print what we'd be proud to own
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Heart className="h-10 w-10 mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">Made With Care</h3>
            <p className="text-sm text-muted-foreground">
              Every order matters to us
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Zap className="h-10 w-10 mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">
              Custom Requests Welcome
            </h3>
            <p className="text-sm text-muted-foreground">
              Just ask—we'll figure it out
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <TrendingUp className="h-10 w-10 mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">Growing Every Day</h3>
            <p className="text-sm text-muted-foreground">
              Your support helps us expand
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

