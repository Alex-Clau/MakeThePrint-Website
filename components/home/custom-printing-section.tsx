import { Button } from "@/components/ui/button";
import { Sparkles, Mail, MessageCircle } from "lucide-react";

export function CustomPrintingSection() {
  return (
    <section className="mx-3 py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-accent-primary-light/10 via-background to-accent-primary-light/5 border-t border-accent-primary/30">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-accent-primary-dark" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent-primary-dark">
              Custom Printing Services
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a unique idea? We specialize in bringing your custom designs to life with precision 3D printing.
            From prototypes to personalized gifts, we're here to make your vision a reality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
          <div className="bg-card border border-accent-primary/20 rounded-lg p-6 sm:p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent-primary/10 flex-shrink-0">
                <Mail className="h-6 w-6 text-accent-primary-dark" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2 text-accent-primary-dark">
                  Email Us
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Send us your design files or describe your project, and we'll provide a custom quote tailored to your needs.
                </p>
                <Button
                  asChild
                  className="bg-accent-primary-dark hover:bg-accent-primary-dark/90 text-white w-full sm:w-auto"
                >
                  <a href="mailto:custom@maketheprint.com">
                    custom@maketheprint.com
                    <Mail className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-card border border-accent-primary/20 rounded-lg p-6 sm:p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent-primary/10 flex-shrink-0">
                <MessageCircle className="h-6 w-6 text-accent-primary-dark" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2 text-accent-primary-dark">
                  WhatsApp
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Quick questions? Reach out to us on WhatsApp for fast responses and instant support.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="border-accent-primary-dark/30 hover:bg-accent-primary/10 w-full sm:w-auto"
                >
                  <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                    Message on WhatsApp
                    <MessageCircle className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            We can discuss pricing, materials, models, and turnaround time based on your specific project needs.
          </p>
        </div>
      </div>
    </section>
  );
}

