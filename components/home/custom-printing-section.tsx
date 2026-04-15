import { Button } from "@/components/ui/button";
import { Sparkles, Mail, MessageCircle } from "lucide-react";
import { messages } from "@/lib/messages";
import { getPublicContactEmail } from "@/lib/public-contact-email";

export function CustomPrintingSection() {
  const t = messages.home;
  const contactEmail = getPublicContactEmail();
  const phoneDigits = process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(/\D/g, "") ?? "";
  const waHref = `https://wa.me/${phoneDigits}`;

  return (
    <section className="mx-3 py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-accent-primary-light/10 via-background to-accent-primary-light/5 border-t border-accent-primary/30">
      <div className="max-w-4xl mx-auto px-5 sm:px-4 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="mb-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3 sm:items-start">
            <Sparkles className="h-6 w-6 shrink-0 text-accent-primary-dark sm:mt-1.5" aria-hidden />
            <h2 className="max-w-full text-balance text-center text-2xl font-bold text-accent-primary-dark sm:text-left sm:text-3xl lg:text-4xl">
              {t.customTitle}
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.customSubhead}
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
                  {t.emailUs}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{t.emailUsDesc}</p>
                {contactEmail ? (
                  <Button
                    asChild
                    className="bg-accent-primary-dark hover:bg-accent-primary-dark/90 text-white w-full sm:w-auto"
                  >
                    <a href={`mailto:${contactEmail}`}>
                      {contactEmail}
                      <Mail className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">{t.publicContactEmailMissing}</p>
                )}
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
                  {t.whatsapp}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{t.whatsappDesc}</p>
                  <Button
                    asChild
                    variant="outline"
                    className="border-accent-primary-dark/30 hover:bg-accent-primary/10 w-full sm:w-auto"
                  >
                    <a href={waHref} target="_blank" rel="noopener noreferrer">
                      {t.messageOnWhatsApp}
                      <MessageCircle className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">{t.customFooter}</p>
        </div>
      </div>
    </section>
  );
}
