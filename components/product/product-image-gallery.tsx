"use client";

import { useState, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ProductImageGalleryProps } from "@/types/product-components";

const SWIPE_THRESHOLD = 50;

export function ProductImageGallery({
  images,
  alt,
  defaultImage,
}: ProductImageGalleryProps) {
  const allImages = defaultImage
    ? [defaultImage, ...(images || []).filter((img) => img && img !== defaultImage)]
    : images && images.length > 0
    ? images
    : defaultImage
    ? [defaultImage]
    : [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const nextImage = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % Math.max(allImages.length, 1));
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + Math.max(allImages.length, 1)) % Math.max(allImages.length, 1));
  }, [allImages.length]);

  const goToImage = (index: number) => {
    setSelectedIndex(index);
  };

  if (allImages.length === 0) {
    return null;
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const delta = touchStartX.current - endX;
    touchStartX.current = null;
    if (delta > SWIPE_THRESHOLD) nextImage();
    else if (delta < -SWIPE_THRESHOLD) prevImage();
  };

  return (
    <div className="relative flex w-full flex-col">
      {/* Main image only (counter + dots + thumbs sit below as one block, pulled up vs letterboxing) */}
      <div
        className="relative mx-auto w-full max-h-[min(88dvh,40rem)] max-w-2xl aspect-[3/4] overflow-hidden rounded-lg"
        onTouchStart={allImages.length > 1 ? handleTouchStart : undefined}
        onTouchEnd={allImages.length > 1 ? handleTouchEnd : undefined}
      >
        {allImages.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 h-full w-full transition-opacity duration-200 ease-out ${
              index === selectedIndex ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
          >
            <Image
              src={src}
              alt={`${alt} - Image ${index + 1}`}
              fill
              className="pointer-events-none select-none bg-transparent object-contain"
              sizes="(max-width: 1024px) 100vw, min(672px, 50vw)"
              priority={index === 0}
              draggable={false}
            />
          </div>
        ))}

        {allImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm hover:bg-background"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm hover:bg-background"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Counter + dots + thumbnails: one block, tight internal spacing; negative margin pulls it up into object-contain letterbox */}
      {allImages.length > 1 && (
        <div className="relative z-10 mx-auto -mt-8 flex w-full max-w-2xl flex-col items-center gap-1 pt-1 sm:-mt-10">
          <div className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium shadow-md backdrop-blur-sm">
            {selectedIndex + 1} / {allImages.length}
          </div>
          <div className="flex justify-center gap-2">
            {allImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToImage(index)}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  selectedIndex === index
                    ? "w-6 bg-accent-primary-dark"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
          <div className="w-full">
            <div className="flex justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToImage(index)}
                  className={`relative aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                    selectedIndex === index
                      ? "scale-105 border-accent-primary-dark shadow-lg"
                      : "border-transparent opacity-70 hover:border-accent-primary/50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${alt} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                    draggable={false}
                  />
                  {selectedIndex === index && (
                    <div className="absolute inset-0 bg-accent-primary/20" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
