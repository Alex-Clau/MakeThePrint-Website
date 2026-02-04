"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ProductImageGalleryProps } from "@/types/product-components";

export function ProductImageGallery({
  images,
  alt,
  defaultImage,
}: ProductImageGalleryProps) {
  // Combine default image with additional images
  const allImages = defaultImage
    ? [defaultImage, ...(images || []).filter((img) => img && img !== defaultImage)]
    : images && images.length > 0
    ? images
    : defaultImage
    ? [defaultImage]
    : [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (allImages.length === 0) {
    return null;
  }

  const currentImage = allImages[selectedIndex];

  const nextImage = useCallback(() => {
    setDirection(1);
    setSelectedIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setSelectedIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const goToImage = (index: number) => {
    setDirection(index > selectedIndex ? 1 : -1);
    setSelectedIndex(index);
  };

  // Handle drag/swipe
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    const velocityThreshold = 500;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      // Swiped left - go to next
      nextImage();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      // Swiped right - go to previous
      prevImage();
    }
  };

  // Slide variants for animation
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full">
      {/* Main Image Display */}
      <div className="relative w-full aspect-square max-w-md mx-auto min-h-[300px] overflow-hidden rounded-lg bg-muted/30 shadow-2xl">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={selectedIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag={allImages.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          >
            <Image
              src={currentImage}
              alt={`${alt} - Image ${selectedIndex + 1}`}
              fill
              className="object-contain pointer-events-none select-none"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={selectedIndex === 0}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

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

      {/* Dot Indicators */}
      {allImages.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
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

      {/* Thumbnail Navigation */}
      {allImages.length > 1 && (
        <div className="mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
            {allImages.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedIndex === index
                    ? "border-accent-primary-dark scale-105 shadow-lg"
                    : "border-transparent hover:border-accent-primary/50 opacity-70 hover:opacity-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
                  <motion.div
                    className="absolute inset-0 bg-accent-primary/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
