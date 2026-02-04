"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart } from "lucide-react";
import { transformProductToCardData } from "@/lib/utils/products";
import { WishlistItemProps } from "@/types/wishlist";

export function WishlistItem({ product, onRemove }: WishlistItemProps) {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://via.placeholder.com/400";
  const productCardData = transformProductToCardData({
    ...product,
    images: product.images || [],
  });

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <CardContent className="p-3 sm:p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-base sm:text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xl sm:text-2xl font-bold">{product.price.toFixed(2)} RON</p>
        </Link>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          className="flex-1 h-10 sm:h-10 text-xs sm:text-sm"
          onClick={() => onRemove(product.id)}
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Remove
        </Button>
        <Button className="flex-1 h-10 sm:h-10 text-xs sm:text-sm" asChild>
          <Link href={`/products/${product.id}`}>
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

