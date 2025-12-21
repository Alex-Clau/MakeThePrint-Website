"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart } from "lucide-react";
import { ProductCardProps } from "@/types/components";

export function ProductCard({
  id,
  name,
  price,
  image,
  category,
  featured,
  rating = 4.5,
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
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
        <Link href={`/products/${id}`}>
          <motion.div
            className="relative aspect-square overflow-hidden bg-muted"
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
            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={false}
            />
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          {featured && (
            <Badge className="absolute top-2 left-2 bg-primary">
              Featured
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background z-10"
            onClick={(e) => {
              e.preventDefault();
              // Add to wishlist
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
          </motion.div>
        </Link>
      <CardContent className="p-3 sm:p-4">
        <Link href={`/products/${id}`}>
          <div className="space-y-1.5 sm:space-y-2">
            {category && (
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                {category}
              </p>
            )}
            <h3 className="font-semibold text-base sm:text-lg group-hover:text-primary transition-colors line-clamp-2">
              {name}
            </h3>
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
                ({rating})
              </span>
            </div>
          </div>
        </Link>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
        <div>
          <p className="text-xl sm:text-2xl font-bold">${price.toFixed(2)}</p>
        </div>
        <Button
          size="sm"
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm w-full sm:w-auto"
          onClick={(e) => {
            e.preventDefault();
            // Add to cart
          }}
        >
          <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden min-[375px]:inline">Add to Cart</span>
          <span className="min-[375px]:hidden">Add</span>
        </Button>
      </CardFooter>
    </Card>
    </motion.div>
  );
}

