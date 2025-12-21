"use client";

import { motion } from "framer-motion";
import { ProductDetailForm } from "@/components/product/product-detail-form";
import { AnimatedProductImage } from "@/components/product/animated-product-image";
import { AnimatedProductPageContentProps } from "@/types/components";

export function AnimatedProductPageContent({
  product,
}: AnimatedProductPageContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start lg:items-center relative">

      {/* Left Side - Product Info */}
      <motion.div
        initial={{ 
          opacity: 0, 
          x: -100,
          y: 50,
          rotateY: -45,
          filter: "blur(20px)",
        }}
        animate={{ 
          opacity: 1, 
          x: 0,
          y: 0,
          rotateY: 0,
          filter: "blur(0px)",
        }}
        transition={{ 
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 0.8,
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
        >
          <ProductDetailForm product={product} />
        </motion.div>
      </motion.div>

      {/* Right Side - Animated Product Image */}
      <motion.div
        initial={{ 
          opacity: 0, 
          x: 100,
          y: 50,
          rotateY: 45,
          scale: 0.5,
          filter: "blur(20px)",
        }}
        animate={{ 
          opacity: 1, 
          x: 0,
          y: 0,
          rotateY: 0,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 1,
          delay: 0.3,
          ease: [0.16, 1, 0.3, 1],
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        style={{ perspective: 1000 }}
        className="relative flex items-center justify-center group"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            type: "spring",
            stiffness: 150,
            damping: 12,
          }}
        >
          <AnimatedProductImage src={product.image} alt={product.name} />
        </motion.div>
      </motion.div>
    </div>
  );
}

