"use client";

import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomLettersFormProps } from "@/types/product-components";
import { getPriceForSize, getSizeLabels } from "@/lib/utils/custom-letters-pricing";
import { useTranslations } from "@/components/locale-provider";

export function CustomLettersForm({
  availableFonts,
  customConfig,
  text,
  onTextChange,
  onConfigChange,
}: CustomLettersFormProps) {
  const t = useTranslations().product;
  const c = useTranslations().common;
  const sizeLabels = getSizeLabels(customConfig.sizePrices);
  const firstSize = sizeLabels[0] ?? "";

  const [font, setFont] = useState(customConfig.defaultFont || availableFonts[0] || "");
  const [color, setColor] = useState(customConfig.colors?.[0] || "black");
  const [size, setSize] = useState<string>(firstSize);
  const [isOutdoor, setIsOutdoor] = useState(false);
  const [isLedStrip, setIsLedStrip] = useState(false);
  const [isColor, setIsColor] = useState(false);

  const onConfigChangeRef = useRef(onConfigChange);
  onConfigChangeRef.current = onConfigChange;

  const showOutdoorOption = customConfig.isOutdoor === true;
  const showLedStripOption = customConfig.isLedStrip === true;
  const showColorOption = customConfig.isColor === true;
  const hasOptions = showOutdoorOption || showLedStripOption || showColorOption;

  useEffect(() => {
    if (sizeLabels.length > 0) {
      if (!size || !sizeLabels.includes(size)) {
        const newSize = sizeLabels[0] ?? "";
        setSize(newSize);
        // Push updated price to parent immediately when size is synced
        const pricePerLetter = getPriceForSize(customConfig.sizePrices, newSize);
        const lettersTotal = text.length * pricePerLetter;
        const o = showOutdoorOption && isOutdoor ? (customConfig.outdoorPrice ?? 0) : 0;
        const l = showLedStripOption && isLedStrip ? (customConfig.ledStripPrice ?? 0) : 0;
        const col = showColorOption && isColor ? (customConfig.colorPrice ?? 0) : 0;
        onConfigChangeRef.current({
          text,
          characterCount: text.length,
          font,
          color,
          size: newSize,
          totalPrice: lettersTotal + o + l + col,
          isOutdoor: showOutdoorOption ? isOutdoor : undefined,
          isLedStrip: showLedStripOption ? isLedStrip : undefined,
          isColor: showColorOption ? isColor : undefined,
        });
      }
    }
  }, [sizeLabels.join(","), size, customConfig.sizePrices, customConfig.outdoorPrice, customConfig.ledStripPrice, customConfig.colorPrice, showOutdoorOption, showLedStripOption, showColorOption, isOutdoor, isLedStrip, isColor, text, font, color]);

  const colors = customConfig.colors || ["black", "white"];
  const characterCount = text.length;
  const priceForSize = getPriceForSize(customConfig.sizePrices, size); // price per letter for selected size
  const lettersTotal = characterCount * priceForSize;
  const outdoorAddOn = showOutdoorOption && isOutdoor ? (customConfig.outdoorPrice ?? 0) : 0;
  const ledStripAddOn = showLedStripOption && isLedStrip ? (customConfig.ledStripPrice ?? 0) : 0;
  const colorAddOn = showColorOption && isColor ? (customConfig.colorPrice ?? 0) : 0;
  const totalPrice = lettersTotal + outdoorAddOn + ledStripAddOn + colorAddOn;

  useEffect(() => {
    onConfigChangeRef.current({
      text,
      characterCount,
      font,
      color,
      size,
      totalPrice,
      isOutdoor: showOutdoorOption ? isOutdoor : undefined,
      isLedStrip: showLedStripOption ? isLedStrip : undefined,
      isColor: showColorOption ? isColor : undefined,
    });
  }, [text, characterCount, font, color, size, totalPrice, isOutdoor, isLedStrip, isColor, showOutdoorOption, showLedStripOption, showColorOption]);

  const handleFontChange = (newFont: string) => {
    setFont(newFont);
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Text input: when user types here, parent updates preview and price recalculates */}
      {onTextChange && (
        <div className="space-y-2">
          <Label className="text-sm sm:text-base font-semibold" htmlFor="custom-letters-text">
            {t.yourText}
          </Label>
          <textarea
            id="custom-letters-text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={t.typeTextBelow}
            className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rows={3}
          />
        </div>
      )}
      {text && (
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground p-3 bg-accent-primary/5 rounded-lg">
          <span>{characterCount} {characterCount === 1 ? t.character : t.characters}</span>
          {size && priceForSize > 0 && characterCount > 0 && (
            <>
              <span>•</span>
              <span>{characterCount} × {priceForSize.toFixed(2)} {c.ron} ({size}) = {lettersTotal.toFixed(2)} {c.ron}</span>
            </>
          )}
        </div>
      )}
      {!text && !onTextChange && (
        <p className="text-xs text-muted-foreground p-3 bg-accent-primary/5 rounded-lg">
          {t.typeTextBelow}
        </p>
      )}

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

      {hasOptions && (
        <div className="space-y-2">
          <Label className="text-sm sm:text-base font-semibold mb-2 block">
            Options (toggle what you want)
          </Label>
          <div className="flex flex-col gap-2">
            {showOutdoorOption && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="customer-outdoor"
                    checked={isOutdoor}
                    onCheckedChange={(checked) => setIsOutdoor(checked === true)}
                  />
                  <Label htmlFor="customer-outdoor" className="cursor-pointer font-normal">
                    Outdoor (weather resistant)
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  +{(customConfig.outdoorPrice ?? 0).toFixed(2)} {c.ron}
                </span>
              </div>
            )}
            {showLedStripOption && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="customer-ledstrip"
                    checked={isLedStrip}
                    onCheckedChange={(checked) => setIsLedStrip(checked === true)}
                  />
                  <Label htmlFor="customer-ledstrip" className="cursor-pointer font-normal">
                    LED strip
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  +{(customConfig.ledStripPrice ?? 0).toFixed(2)} {c.ron}
                </span>
              </div>
            )}
            {showColorOption && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="customer-color-option"
                    checked={isColor}
                    onCheckedChange={(checked) => setIsColor(checked === true)}
                  />
                  <Label htmlFor="customer-color-option" className="cursor-pointer font-normal">
                    Color
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  +{(customConfig.colorPrice ?? 0).toFixed(2)} {c.ron}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {sizeLabels.length > 0 && (
        <div>
          <Label className="text-sm sm:text-base font-semibold mb-2 block">
            {t.letterHeight}
          </Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t.letterHeight} />
            </SelectTrigger>
            <SelectContent>
              {sizeLabels.map((label) => {
                const price = getPriceForSize(customConfig.sizePrices, label);
                return (
                  <SelectItem key={label} value={label}>
                    {label} – {price > 0 ? `${price.toFixed(2)} ${c.ron}` : c.ron}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">{t.sizeNote}</p>
        </div>
      )}

      <div className="pt-4 border-t border-accent-primary/20">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t.totalPrice}</span>
          <span className="text-2xl font-bold">
            {totalPrice.toFixed(2)} {c.ron}
          </span>
        </div>
        {characterCount > 0 && size && priceForSize > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {characterCount} {characterCount === 1 ? t.character : t.characters} × {priceForSize.toFixed(2)} {c.ron} ({size}) = {lettersTotal.toFixed(2)} {c.ron}
          </p>
        )}
      </div>
    </div>
  );
}
