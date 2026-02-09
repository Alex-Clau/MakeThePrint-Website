"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ProductDetailForm } from "@/components/product/product-detail-form";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { AnimatedProductPageContentProps } from "@/types/components";
import { getProductDisplayName } from "@/lib/utils/products";
import { useLocale } from "@/components/locale-provider";

export function AnimatedProductPageContent({
  product,
}: AnimatedProductPageContentProps) {
  const { locale } = useLocale();
  const displayName = getProductDisplayName(product, locale);
  const isPreset = product.category === "preset";
  const customConfig = isPreset && product.custom_config && "fonts" in product.custom_config ? product.custom_config : null;
  const [preview, setPreview] = useState<{
    text: string;
    font: string;
    color: string;
    size: string;
  }>({
    text: "",
    font: customConfig?.fonts?.[0] || customConfig?.defaultFont || product.material_options[0] || "",
    color: customConfig?.colors?.[0] || "black",
    size: "",
  });
  // Get all images, using image as fallback if images array is empty
  const allImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
    ? [product.image] 
    : [];

  return (
    <div className="space-y-12 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start lg:items-center relative">

      {/* Left Side - Product Image Gallery */}
      <motion.div
        initial={{ 
          opacity: 0, 
          x: -100,
          y: 50,
          rotateY: -45,
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
          filter: {
            duration: 1,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
          },
        }}
        style={{ perspective: 1000 }}
        className="relative flex items-center justify-start group"
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
          className="w-full"
        >
          <ProductImageGallery
            images={allImages.length > 1 ? allImages.slice(1) : []} // All images except the first
            alt={displayName}
            defaultImage={allImages[0] || undefined} // First image as default
          />
        </motion.div>
      </motion.div>

      {/* Right Side - Product Info */}
      <motion.div
        initial={{ 
          opacity: 0, 
          x: 100,
          y: 50,
          rotateY: 45,
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
          filter: {
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          },
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
          <ProductDetailForm 
            product={product}
            previewText={preview.text}
            onPreviewChange={setPreview}
          />
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
}

