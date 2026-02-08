"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomLettersFormProps } from "@/types/product-components";
import { getPricePerCharacter, calculateCustomLettersPrice, isOutdoorProduct } from "@/lib/utils/custom-letters-pricing";
import { useTranslations } from "@/components/locale-provider";

export function CustomLettersForm({
  pricePerCharacter, // This is now ignored, we use size-based pricing
  availableFonts,
  customConfig,
  productName = "",
  text, // Text now comes from the preview box
  onConfigChange,
}: CustomLettersFormProps) {
  const t = useTranslations().product;
  const c = useTranslations().common;
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
          <span>{characterCount} {characterCount === 1 ? t.character : t.characters}</span>
          <span>•</span>
          <span>{currentPricePerCharacter.toFixed(2)} {t.ronPerChar} ({size} cm)</span>
        </div>
      )}
      {!text && (
        <p className="text-xs text-muted-foreground p-3 bg-accent-primary/5 rounded-lg">
          {t.typeTextBelow}
        </p>
      )}

      {/* Font Selector */}
      {availableFonts.length > 0 && (
        <div>
          <Label className="text-sm sm:text-base font-semibold mb-2 block">
            {t.selectFont}
          </Label>
          <Select value={font} onValueChange={handleFontChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t.selectFont} />
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
          {t.selectColor}
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
        <p className="text-xs text-muted-foreground mt-2">{t.selected}: {color}</p>
      </div>

      {/* Size Selector */}
      <div>
        <Label className="text-sm sm:text-base font-semibold mb-2 block">
          {t.letterHeight}
        </Label>
        <Select value={size.toString()} onValueChange={(value) => setSize(Number(value))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t.letterHeight} />
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
          {t.sizeNote}
          {isOutdoor && (
            <span className="block mt-1 font-medium text-accent-primary-dark">
              {t.outdoorNote}
            </span>
          )}
        </p>
      </div>

      {/* Total Price Display */}
      <div className="pt-4 border-t border-accent-primary/20">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t.totalPrice}</span>
          <span className="text-2xl font-bold">
            {totalPrice.toFixed(2)} {c.ron}
          </span>
        </div>
        {characterCount > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {characterCount} {t.characters} × {currentPricePerCharacter.toFixed(2)} {c.ron} ({size} cm)
          </p>
        )}
      </div>
    </div>
  );
}
