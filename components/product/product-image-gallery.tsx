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

  if (allImages.length === 0) {
    return null;
  }

  const nextImage = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const goToImage = (index: number) => {
    setSelectedIndex(index);
  };

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
    <div className="relative w-full flex flex-col lg:flex-row lg:gap-4 lg:items-start">
      {/* Desktop: vertical thumbnails on the left */}
      {allImages.length > 1 && (
        <div className="hidden lg:flex flex-col gap-2 flex-shrink-0 order-1">
          {allImages.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToImage(index)}
              className={`relative w-14 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                selectedIndex === index
                  ? "border-accent-primary-dark shadow-lg"
                  : "border-transparent hover:border-accent-primary/50 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="56px"
                draggable={false}
              />
              {selectedIndex === index && (
                <div className="absolute inset-0 bg-accent-primary/20" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div
        className="relative w-full aspect-[3/4] max-w-2xl mx-auto lg:mx-0 lg:flex-1 lg:order-2 overflow-hidden rounded-lg"
        onTouchStart={allImages.length > 1 ? handleTouchStart : undefined}
        onTouchEnd={allImages.length > 1 ? handleTouchEnd : undefined}
      >
        {allImages.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-200 ease-out ${
              index === selectedIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={src}
              alt={`${alt} - Image ${index + 1}`}
              fill
              className="object-contain pointer-events-none select-none bg-transparent"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index === 0}
              draggable={false}
            />
          </div>
        ))}

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg z-20"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg z-20"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium shadow-lg z-20">
            {selectedIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Dot Indicators - mobile only */}
      {allImages.length > 1 && (
        <div className="flex lg:hidden justify-center gap-2 mt-4">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                selectedIndex === index
                  ? "bg-accent-primary-dark w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Navigation - mobile only */}
      {allImages.length > 1 && (
        <div className="lg:hidden mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
            {allImages.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToImage(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 active:scale-95 aspect-square ${
                  selectedIndex === index
                    ? "border-accent-primary-dark scale-105 shadow-lg"
                    : "border-transparent hover:border-accent-primary/50 opacity-70 hover:opacity-100"
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
      )}
    </div>
  );
}
