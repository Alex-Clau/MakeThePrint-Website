"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCardProps } from "@/types/components";
import { ProductCardActions } from "./product-card-actions";
import { messages } from "@/lib/messages";

export function ProductCard({
  id,
  name,
  price,
  image,
  category,
  rating,
  review_count,
  isInWishlist = false,
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
            <div className="relative aspect-[4/3] overflow-hidden bg-muted transition-transform duration-200 ease-out group-hover:scale-[1.03]">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>
          <div className="absolute top-2 right-2 z-20">
            <ProductCardActions productId={id} showWishlistOnly isInWishlist={isInWishlist} />
          </div>
        </div>
      <CardContent className="p-4 flex flex-col gap-3">
        <Link href={`/products/${id}`}>
          <h3 className="font-semibold text-base sm:text-lg group-hover:text-accent-primary-dark transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>
        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-2 min-h-9">
          <div className="flex items-center min-w-0">
            {isInquire ? (
              <p className="text-sm font-medium text-muted-foreground">{t.contactForPricing}</p>
            ) : (
              <p className="text-sm font-bold">{price.toFixed(2)} {c.ron}</p>
            )}
          </div>
          <div className="w-full sm:w-auto flex-shrink-0">
            {!isInquire && (
              <ProductCardActions productId={id} showCartOnly isInWishlist={isInWishlist} />
            )}
          </div>
        </div>
        <div className="w-full pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5 min-h-[1.5rem]">
            {rating !== undefined && rating > 0 ? (
              <>
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
                  {review_count !== undefined ? `${review_count} ${review_count === 1 ? r.review : r.reviews}` : ""}
                </span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground/70">{r.noReviewsYet}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

