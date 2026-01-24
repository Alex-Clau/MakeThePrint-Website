"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCardProps } from "@/types/components";
import { ProductCardActions } from "./product-card-actions";

export function ProductCard({
  id,
  name,
  price,
  image,
  featured,
  rating,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={{ 
        duration: 0.5,
        type: "spring",
        stiffness: 150,
        damping: 15,
      }}
      whileHover={{ 
        y: -12,
        scale: 1.02,
        rotateY: 5,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.95, rotateY: -5 }}
      style={{ perspective: 1000 }}
      className="relative z-10"
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-accent-primary-light/20 hover:border-accent-primary/60">
        <div className="relative">
          <Link href={`/products/${id}`}>
            <motion.div
              className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-muted"
              whileHover={{ 
                scale: 1.1,
                rotateZ: 2,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
              }}
            >
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          </Link>
          {featured && (
            <Badge className="absolute top-2 left-2 bg-accent-primary-dark text-white z-20">
              Featured
            </Badge>
          )}
          <div className="absolute top-2 right-2 z-20">
            <ProductCardActions productId={id} showWishlistOnly />
          </div>
        </div>
      <CardContent className="p-3 sm:p-4">
        <Link href={`/products/${id}`}>
          <div className="space-y-1.5 sm:space-y-2">
            <h3 className="font-semibold text-base sm:text-lg group-hover:text-accent-primary-dark transition-colors line-clamp-2">
              {name}
            </h3>
            {rating && (
              <div className="flex items-center gap-1.5 sm:gap-2">
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
                  ({rating.toFixed(1)})
                </span>
              </div>
            )}
          </div>
        </Link>
      </CardContent>
      <CardFooter className="p-4 sm:p-4 pt-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <p className="text-xl sm:text-2xl font-bold">{price.toFixed(2)} RON</p>
        </div>
        <div className="w-full sm:w-auto">
          <ProductCardActions productId={id} showCartOnly />
        </div>
      </CardFooter>
    </Card>
    </motion.div>
  );
}

