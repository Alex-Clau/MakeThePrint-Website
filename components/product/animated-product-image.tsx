"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AnimatedProductImageProps } from "@/types/components";

export function AnimatedProductImage({ src, alt }: AnimatedProductImageProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const maxRotate = 15;
    const rotateXValue = (mouseY / (rect.height / 2)) * maxRotate;
    const rotateYValue = (mouseX / (rect.width / 2)) * maxRotate;
    
    setRotateX(-rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-square max-w-md cursor-pointer"
      style={{
        perspective: "1000px",
      }}
    >
      <motion.div
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full"
      >
        <div className="relative w-full h-full bg-muted/30 rounded-lg overflow-hidden shadow-lg">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain"
            style={{ display: "block" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

