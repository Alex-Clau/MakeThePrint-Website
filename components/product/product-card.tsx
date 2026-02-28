"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCardProps } from "@/types/components";
import { ProductCardActions } from "./product-card-actions";
import { messages } from "@/lib/messages";

export function ProductCard({
  id,
  name,
  price,
  image,
  category,
  featured,
  rating,
  review_count,
}: ProductCardProps) {
  const isInquire = category === "inquire";
  const t = messages.product;
  const c = messages.common;
  const r = messages.reviews;
  return (
    <div className="relative z-10 mx-3 sm:mx-0">
      <Card className="group overflow-hidden transition-shadow duration-200 border-2 border-accent-primary-light/20 hover:border-accent-primary/60 hover:shadow-lg">
        <div className="relative overflow-hidden">
          <Link href={`/products/${id}`}>
            <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-muted transition-transform duration-200 ease-out group-hover:scale-[1.03]">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>
          <div className="absolute top-2 left-2 z-20 flex flex-col gap-2">
            {featured && (
              <Badge className="bg-accent-primary-dark text-white">
                {t.featured}
              </Badge>
            )}
            {isInquire && (
              <Badge className="bg-green-600 text-white">
                {t.customInquiry}
              </Badge>
            )}
          </div>
          <div className="absolute top-2 right-2 z-20">
            <ProductCardActions productId={id} showWishlistOnly />
          </div>
        </div>
      <CardContent className="p-3 sm:p-4">
        <Link href={`/products/${id}`}>
          <h3 className="font-semibold text-base sm:text-lg group-hover:text-accent-primary-dark transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>
      </CardContent>
      <CardFooter className="p-4 sm:p-4 pt-0 flex flex-col gap-3">
        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            {isInquire ? (
              <p className="text-sm sm:text-base font-medium text-muted-foreground">{t.contactForPricing}</p>
            ) : (
              <p className="text-lg sm:text-lg font-bold">{price.toFixed(2)} {c.ron}</p>
            )}
          </div>
          {!isInquire && (
            <div className="w-full sm:w-auto">
              <ProductCardActions productId={id} showCartOnly />
            </div>
          )}
        </div>
        {rating !== undefined && rating > 0 && (
          <div className="w-full flex items-center gap-1.5 border-t border-accent-primary/10 pt-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xs sm:text-sm ${
                    i < Math.floor(rating)
                      ? "text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {review_count !== undefined ? `${review_count} ${review_count === 1 ? r.review : r.reviews}` : ''}
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
    </div>
  );
}

