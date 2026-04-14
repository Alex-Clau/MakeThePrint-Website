"use client";

import { useState } from "react";
import { ProductDetailForm } from "@/components/product/product-detail-form";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { AnimatedProductPageContentProps } from "@/types/components";
import { getProductDisplayName, isPresetLettersConfig } from "@/lib/utils/products";

export function AnimatedProductPageContent({
  product,
  averageRating = 0,
  totalReviews = 0,
  isInWishlist = false,
}: AnimatedProductPageContentProps) {
  const displayName = getProductDisplayName(product);
  const isPreset = product.category === "preset";
  const customConfig =
    isPreset && isPresetLettersConfig(product.custom_config)
      ? product.custom_config
      : null;
  const [preview, setPreview] = useState<{
    text: string;
    font: string;
    color: string;
    size: string;
  }>({
    text: "",
    font: customConfig?.fonts?.[0] || customConfig?.defaultFont  || "",
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
    <div className="space-y-10 sm:space-y-12 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-start relative">
        {/* Left Side - Product Image Gallery */}
        <div className="relative flex flex-col items-stretch justify-start group">
          <div className="w-full">
            <ProductImageGallery
              images={allImages.length > 1 ? allImages.slice(1) : []}
              alt={displayName}
              defaultImage={allImages[0] || undefined}
            />
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div>
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
    </div>
  );
}

