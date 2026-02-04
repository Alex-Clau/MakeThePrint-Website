"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { ProductListItemProps } from "@/types/components";
import { ProductCardActions } from "./product-card-actions";

export function ProductListItem({ product }: ProductListItemProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-accent-primary-light/20 hover:border-accent-primary/60 relative z-10">
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
              <h3 className="font-semibold text-base sm:text-lg lg:text-xl group-hover:text-accent-primary-dark transition-colors mb-2 line-clamp-2">
                {product.name}
              </h3>
            </Link>
          </div>
          <div className="flex flex-col gap-3 pt-2 border-t border-accent-primary/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <p className="text-xl sm:text-2xl font-bold">{product.price.toFixed(2)} RON</p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <ProductCardActions productId={product.id} />
              </div>
            </div>
            {product.rating !== undefined && product.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs sm:text-sm ${
                        i < Math.floor(product.rating as number)
                          ? "text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {product.review_count !== undefined ? `${product.review_count} ${product.review_count === 1 ? 'review' : 'reviews'}` : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

