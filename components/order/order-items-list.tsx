import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { OrderItemsListProps } from "@/types/order";

export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Order Items</h2>
        <div className="space-y-4">
          {items.map((item) => {
            return (
              <div key={item.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-4 border-b last:border-0">
                <div className="relative w-full sm:w-20 h-32 sm:h-20 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src="https://via.placeholder.com/80"
                    alt={item.products.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 80px"
                  />
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 min-w-0">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-2">
                      {item.products.name}
                    </h3>
                    {item.material && (
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Feature: {item.material}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="font-semibold text-base sm:text-lg">
                      {(item.price * item.quantity).toFixed(2)} RON
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {item.price.toFixed(2)} RON each
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

