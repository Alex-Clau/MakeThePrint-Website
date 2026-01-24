import { Card, CardContent } from "@/components/ui/card";

export function WhatsComingNext() {
  return (
    <section className="mb-8">
      <Card>
        <CardContent className="p-6 sm:p-8 lg:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            What's Coming Next
          </h2>
          <p className="text-muted-foreground mb-6">
            We're just getting started. Here's what we're working on to make
            MakeThePrint even better for you:
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">New Product Types</h3>
              <p className="text-sm text-muted-foreground">
                Expanding beyond our current lineup into new categories you've
                been asking for
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Faster Turnaround
              </h3>
              <p className="text-sm text-muted-foreground">
                Adding more printers so we can ship your orders even quicker
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Advent Specials</h3>
              <p className="text-sm text-muted-foreground">
                Special advent collections for christmas, holidays, and
                seasonal moments
              </p>
            </div>
          </div>
          <p className="text-muted-foreground mt-6">
            Every order, every customer, every moment of support gets us closer
            to these goals. Thank you for being part of our journey.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

