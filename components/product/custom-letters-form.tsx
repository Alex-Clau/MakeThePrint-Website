"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomLettersFormProps } from "@/types/product-components";
import { getPricePerCharacter, calculateCustomLettersPrice, isOutdoorProduct } from "@/lib/utils/custom-letters-pricing";

export function CustomLettersForm({
  pricePerCharacter, // This is now ignored, we use size-based pricing
  availableFonts,
  customConfig,
  productName = "",
  text, // Text now comes from the preview box
  onConfigChange,
}: CustomLettersFormProps) {
  const [font, setFont] = useState(customConfig.defaultFont || availableFonts[0] || "");
  const [color, setColor] = useState(customConfig.colors?.[0] || "black");
  const [size, setSize] = useState<number>(20); // Default 20cm

  const colors = customConfig.colors || ["black", "white"];
  const isOutdoor = isOutdoorProduct(productName);

  // Calculate character count (including spaces and special characters)
  const characterCount = text.length;
  // Get price per character based on selected size and product type
  const currentPricePerCharacter = getPricePerCharacter(size, isOutdoor);
  const totalPrice = calculateCustomLettersPrice(text, size, isOutdoor);

  // Update parent when config changes
  useEffect(() => {
    onConfigChange({
      text,
      characterCount,
      font,
      color,
      size,
      totalPrice,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, font, color, size]);

  const handleFontChange = (newFont: string) => {
    setFont(newFont);
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Character count and pricing info */}
      {text && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-accent-primary/5 rounded-lg">
          <span>{characterCount} {characterCount === 1 ? "character" : "characters"}</span>
          <span>•</span>
          <span>{currentPricePerCharacter.toFixed(2)} RON per character ({size} cm)</span>
        </div>
      )}
      {!text && (
        <p className="text-xs text-muted-foreground p-3 bg-accent-primary/5 rounded-lg">
          Type your text in the preview box below. Each character (including spaces) is priced separately.
        </p>
      )}

      {/* Font Selector */}
      {availableFonts.length > 0 && (
        <div>
          <Label className="text-sm sm:text-base font-semibold mb-2 block">
            Select a Font:
          </Label>
          <Select value={font} onValueChange={handleFontChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {availableFonts.map((fontOption) => (
                <SelectItem key={fontOption} value={fontOption}>
                  {fontOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Color Selector */}
      <div>
        <Label className="text-sm sm:text-base font-semibold mb-2 block">
          Select a Color:
        </Label>
        <div className="flex gap-3 flex-wrap">
          {colors.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              onClick={() => handleColorChange(colorOption)}
              className={`w-12 h-12 rounded-lg border-2 transition-all ${
                color === colorOption
                  ? "border-accent-primary-dark scale-110"
                  : "border-gray-300 dark:border-gray-600 hover:border-accent-primary/50"
              }`}
              style={{
                backgroundColor:
                  colorOption === "white"
                    ? "#ffffff"
                    : colorOption === "black"
                    ? "#000000"
                    : colorOption === "beige" || colorOption === "tan"
                    ? "#d2b48c"
                    : colorOption === "brown" || colorOption === "dark brown"
                    ? "#8b4513"
                    : colorOption,
              }}
              title={colorOption}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Selected: {color}</p>
      </div>

      {/* Size Selector */}
      <div>
        <Label className="text-sm sm:text-base font-semibold mb-2 block">
          Letter Height:
        </Label>
        <Select value={size.toString()} onValueChange={(value) => setSize(Number(value))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 cm - {getPricePerCharacter(5, isOutdoor).toFixed(2)} RON/char</SelectItem>
            <SelectItem value="10">10 cm - {getPricePerCharacter(10, isOutdoor).toFixed(2)} RON/char</SelectItem>
            <SelectItem value="15">15 cm - {getPricePerCharacter(15, isOutdoor).toFixed(2)} RON/char</SelectItem>
            <SelectItem value="20">20 cm - {getPricePerCharacter(20, isOutdoor).toFixed(2)} RON/char</SelectItem>
            <SelectItem value="24">24 cm - {getPricePerCharacter(24, isOutdoor).toFixed(2)} RON/char</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          This is the height of each letter on your wall. Price per character varies by size.
          {isOutdoor && (
            <span className="block mt-1 font-medium text-accent-primary-dark">
              Premium outdoor material - weather resistant
            </span>
          )}
        </p>
      </div>

      {/* Total Price Display */}
      <div className="pt-4 border-t border-accent-primary/20">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Price:</span>
          <span className="text-2xl font-bold">
            {totalPrice.toFixed(2)} RON
          </span>
        </div>
        {characterCount > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {characterCount} characters × {currentPricePerCharacter.toFixed(2)} RON ({size} cm)
          </p>
        )}
      </div>
    </div>
  );
}
