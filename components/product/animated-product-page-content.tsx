"use client";

import { useState } from "react";
import { ProductDetailForm } from "@/components/product/product-detail-form";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { AnimatedProductPageContentProps } from "@/types/components";
import type { CustomProductConfig } from "@/types/product";
import { getProductDisplayName, normalizeProductCategory } from "@/lib/utils/products";
import { isPresetCustomLettersProduct } from "@/lib/utils/preset-letter-config";

export function AnimatedProductPageContent({
  product,
  averageRating = 0,
  totalReviews = 0,
  isInWishlist = false,
}: AnimatedProductPageContentProps) {
  const displayName = getProductDisplayName(product);
  const category = normalizeProductCategory(product.category);
  const isPreset = category === "preset";
  const lettersPreviewConfig: CustomProductConfig | null =
    isPreset && isPresetCustomLettersProduct(category, product.custom_config)
      ? (product.custom_config as CustomProductConfig)
      : null;
  const [preview, setPreview] = useState<{
    text: string;
    font: string;
    color: string;
    size: string;
  }>({
    text: "",
    font: lettersPreviewConfig?.fonts?.[0] || lettersPreviewConfig?.defaultFont || "",
    color: lettersPreviewConfig?.colors?.[0] || "black",
    size: "",
  });
  // Get all images, using image as fallback if images array is empty
  const allImages = product.images && product.images.length > 0
    ? product.images
    : product.image
    ? [product.image]
    : [];

  return (
    <div className="relative z-10 space-y-10 sm:space-y-12">
      <div className="relative grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="group relative flex w-full flex-col items-stretch justify-start">
          <ProductImageGallery
            images={allImages.length > 1 ? allImages.slice(1) : []}
            alt={displayName}
            defaultImage={allImages[0] || undefined}
          />
        </div>
        <ProductDetailForm
          product={product}
          previewText={preview.text}
          onPreviewChange={setPreview}
          averageRating={averageRating}
          totalReviews={totalReviews}
          isInWishlist={isInWishlist}
        />
      </div>
    </div>
  );
}

