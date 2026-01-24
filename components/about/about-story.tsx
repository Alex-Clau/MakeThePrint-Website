import { Card, CardContent } from "@/components/ui/card";

export function AboutStory() {
  return (
    <section id="story" className="mb-12 sm:mb-16">
      <Card>
        <CardContent className="p-6 sm:p-8 lg:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Honestly? My dad and I just really wanted to make cool printed
              stuff. We weren't trying to build some massive company—we just
              got tired of seeing mediocre prints out there. So we invested in
              some gear, learned the craft, and decided to do it our way.
            </p>
            <p>
              Right now, we've got a collection we're genuinely proud of. These
              are designs we've chosen because we think they look incredible
              when printed. But here's the thing—if you've got something
              specific in mind, just reach out. We love a challenge, and we'll
              do our best to make it happen.
            </p>
            <p>
              The plan? We want to keep growing. More printers, more products, a
              real online store. Every single person who orders from us is
              helping us get there. We're not some faceless company—it's
              literally my dad and me packing these boxes, making sure
              everything's perfect. When you support us, you're supporting two
              people who actually care about what they're doing.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

