"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { ProductCardData } from "@/types/product";

interface ProductListItemProps {
  product: ProductCardData;
}

export function ProductListItem({ product }: ProductListItemProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
        <Link href={`/products/${product.id}`} className="flex-shrink-0">
          <div className="relative w-full sm:w-32 lg:w-40 h-40 sm:h-32 lg:h-36 overflow-hidden bg-muted rounded-lg">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 128px, 160px"
            />
          </div>
        </Link>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="flex-1">
            <Link href={`/products/${product.id}`}>
              {product.category && (
                <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mb-1">
                  {product.category}
                </p>
              )}
              <h3 className="font-semibold text-base sm:text-lg lg:text-xl group-hover:text-primary transition-colors mb-2 line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs sm:text-sm ${
                        i < Math.floor(product.rating || 4.5)
                          ? "text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  ({product.rating})
                </span>
              </div>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-2 border-t border-border/50">
            <p className="text-xl sm:text-2xl font-bold">${product.price.toFixed(2)}</p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 bg-background/80 hover:bg-background flex-shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  // Add to wishlist
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  // Add to cart
                }}
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

