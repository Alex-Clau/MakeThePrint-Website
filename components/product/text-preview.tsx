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

// Parse admin-defined size label (e.g. "10cm", "20") to number for display
const parseSizeToCm = (sizeLabel: string): number => {
  const match = sizeLabel.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 20;
};

// Convert CM to CSS font size
const getFontSize = (sizeCm: number) => {
  const pixels = sizeCm * 3.78;
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

const MAX_TEXT_LENGTH = 50; // Default maximum characters

export function TextPreview({ text, font, color, size, maxLength = MAX_TEXT_LENGTH, onTextChange }: TextPreviewProps) {
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
  const sizeCm = parseSizeToCm(size);
  const fontSize = getFontSize(sizeCm);
  const fontFamily = getFontFamily(font);
  const remainingChars = maxLength - text.length;
  const isNearLimit = remainingChars <= 10;

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
              maxLength={maxLength}
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
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2 border-t border-accent-primary/10">
            {isEditable && (
              <>
                <span className={isNearLimit ? "text-yellow-500 font-medium" : ""}>
                  {text.length}/{maxLength}
                </span>
                <span>•</span>
              </>
            )}
            <span>Font: {font}</span>
            <span>•</span>
            <span>Color: {color}</span>
            <span>•</span>
            <span>Height: {size}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
