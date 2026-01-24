"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { CartItemsListProps } from "@/types/cart-components";

export function CartItemsList({
  items,
  onUpdateQuantity,
  onRemove,
}: CartItemsListProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative w-full sm:w-20 lg:w-24 h-32 sm:h-20 lg:h-24 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={item.products.images?.[0] || ""}
                  alt={item.products.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {item.products.name}
                  </h3>
                  {item.material && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Feature: {item.material}
                    </p>
                  )}
                  <p className="text-lg font-bold">
                    {parseFloat(item.products.price.toString()).toFixed(2)} RON
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 sm:h-9 sm:w-9 touch-manipulation"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium text-sm">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 sm:h-9 sm:w-9 touch-manipulation"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 sm:h-9 sm:w-9 text-destructive touch-manipulation"
                    onClick={() => onRemove(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

