"use client";

import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TextPreviewProps } from "@/types/product-components";

// Map font names to CSS font families
const getFontFamily = (fontName: string) => {
  const fontMap: Record<string, string> = {
    Tinos: '"Tinos", serif',
    Arial: '"Arial", sans-serif',
    Helvetica: '"Helvetica", sans-serif',
    "Times New Roman": '"Times New Roman", serif',
  };
  return fontMap[fontName] || `"${fontName}", serif`;
};

// Convert CM to CSS font size
// Approximate conversion: 1cm ≈ 37.8px at 96dpi
// We'll use a scale factor for better on-screen display
const getFontSize = (sizeCm: number) => {
  // Convert cm to pixels (1cm ≈ 37.8px, but scaled for better visual representation)
  const pixels = sizeCm * 3.78; // Approximate conversion
  return `${pixels}px`;
};

// Map color name to hex value
const getColorValue = (color: string) => {
  const colorMap: Record<string, string> = {
    white: "#ffffff",
    black: "#000000",
    beige: "#d2b48c",
    tan: "#d2b48c",
    brown: "#8b4513",
    "dark brown": "#8b4513",
  };
  return colorMap[color] || color;
};

export function TextPreview({ text, font, color, size, onTextChange }: TextPreviewProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea to fit content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [text, size, font]);

  const isEditable = !!onTextChange;
  const colorValue = getColorValue(color);
  const fontSize = getFontSize(size);
  const fontFamily = getFontFamily(font);

  return (
    <Card className={`border-accent-primary/30 bg-card/50 ${isEditable ? 'cursor-text' : ''}`}>
      <CardContent className="p-6 sm:p-8 lg:p-12">
        <div className="text-center space-y-3">
          {isEditable ? (
            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Enter your text"
              className="w-full bg-transparent border-none outline-none resize-none text-center font-bold placeholder:text-muted-foreground/50"
              style={{
                fontFamily,
                color: text ? colorValue : undefined,
                fontSize,
                lineHeight: "1.2",
                minHeight: fontSize,
              }}
              rows={1}
            />
          ) : (
            <p
              className="font-bold break-words mx-auto"
              style={{
                fontFamily,
                color: colorValue,
                fontSize,
                lineHeight: "1.2",
              }}
            >
              {text || "Enter your text"}
            </p>
          )}
          {(text || !isEditable) && (
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2 border-t border-accent-primary/10">
              <span>Font: {font}</span>
              <span>•</span>
              <span>Color: {color}</span>
              <span>•</span>
              <span>Height: {size} cm</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
