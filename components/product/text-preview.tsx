"use client";

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

export function TextPreview({ text, font, color, size }: TextPreviewProps) {
  if (!text.trim()) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="p-8 sm:p-12 text-center">
          <p className="text-muted-foreground text-sm sm:text-base font-medium">
            Preview Your Text
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Start typing above to see how your text will look
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-accent-primary/30 bg-card/50">
      <CardContent className="p-6 sm:p-8 lg:p-12">
        <div className="text-center space-y-3">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Preview:</h3>
          </div>
          <p
            className="font-bold break-words mx-auto"
            style={{
              fontFamily: getFontFamily(font),
              color: getColorValue(color),
              fontSize: getFontSize(size),
              lineHeight: "1.2",
            }}
          >
            {text}
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2 border-t border-accent-primary/10">
            <span>Font: {font}</span>
            <span>•</span>
            <span>Color: {color}</span>
            <span>•</span>
            <span>Height: {size} cm</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
