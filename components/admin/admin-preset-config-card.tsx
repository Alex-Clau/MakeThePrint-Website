"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { messages } from "@/lib/messages";
import { PRESET_COLORS, PRESET_FONTS } from "@/lib/constants/preset-options";
import type { ProductFormData } from "./admin-product-form-types";
import type { CustomProductConfig } from "@/types/product";
import { computePresetCustomizationPrice } from "@/lib/utils/preset-customization-pricing";
import {
  countValidSizePricePairs,
  getValidSizePriceEntries,
  presetCustomLettersEnabled,
} from "@/lib/utils/preset-letter-config";

interface AdminPresetConfigCardProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export function AdminPresetConfigCard({ formData, setFormData }: AdminPresetConfigCardProps) {
  const t = messages.admin;
  const presetConfig = formData.custom_config && "colors" in formData.custom_config ? formData.custom_config : undefined;

  const lettersOn = presetCustomLettersEnabled(presetConfig);
  const validPairCount = countValidSizePricePairs(presetConfig);

  const setLettersEnabled = (enabled: boolean) => {
    if (enabled) {
      setFormData((prev) => {
        const pc =
          prev.custom_config && "colors" in prev.custom_config
            ? (prev.custom_config as CustomProductConfig)
            : undefined;
        return {
          ...prev,
          custom_config: {
            ...(pc ?? {}),
            customLettersEnabled: true,
            colors: pc?.colors?.length ? pc.colors : [...PRESET_COLORS],
            fonts: pc?.fonts?.length ? pc.fonts : [...PRESET_FONTS],
            defaultFont: pc?.defaultFont || PRESET_FONTS[0] || "Arial",
            sizePrices: Array.isArray(pc?.sizePrices) ? pc!.sizePrices : [],
            isOutdoor: pc?.isOutdoor ?? false,
            isLedStrip: pc?.isLedStrip ?? false,
            isColor: pc?.isColor ?? false,
            outdoorPrice: pc?.outdoorPrice ?? 0,
            ledStripPrice: pc?.ledStripPrice ?? 0,
            colorPrice: pc?.colorPrice ?? 0,
            pricePerCharacter: pc?.pricePerCharacter ?? 0,
          },
        };
      });
      return;
    }
    setFormData((prev) => {
      const pc =
        prev.custom_config && "colors" in prev.custom_config
          ? (prev.custom_config as CustomProductConfig)
          : undefined;
      return {
        ...prev,
        custom_config: {
          ...(pc ?? {}),
          customLettersEnabled: false,
          colors: [],
          fonts: [],
          defaultFont: "",
          sizePrices: [],
          pricePerCharacter: 0,
          isOutdoor: false,
          isLedStrip: false,
          isColor: false,
          outdoorPrice: 0,
          ledStripPrice: 0,
          colorPrice: 0,
        },
      };
    });
  };

  const toggleColor = (color: string) => {
    const current = presetConfig?.colors || [];
    const next = current.includes(color) ? current.filter((c) => c !== color) : [...current, color];
    setFormData({
      ...formData,
      custom_config: { ...presetConfig, colors: next },
    });
  };

  const toggleFont = (font: string) => {
    const current = presetConfig?.fonts || [];
    const next = current.includes(font) ? current.filter((f) => f !== font) : [...current, font];
    setFormData({
      ...formData,
      custom_config: { ...presetConfig, fonts: next },
    });
  };

  const sizePrices = Array.isArray(presetConfig?.sizePrices) ? presetConfig.sizePrices : [];
  const addSizePrice = () => {
    setFormData({
      ...formData,
      custom_config: {
        ...presetConfig,
        sizePrices: [...sizePrices, { size: "", price: 0 }],
      },
    });
  };
  const updateSizePrice = (index: number, field: "size" | "price", value: string | number) => {
    const next = [...sizePrices];
    next[index] = { ...next[index], [field]: field === "price" ? Number(value) : value };
    setFormData({
      ...formData,
      custom_config: { ...presetConfig, sizePrices: next },
    });
  };
  const removeSizePrice = (index: number) => {
    setFormData({
      ...formData,
      custom_config: {
        ...presetConfig,
        sizePrices: sizePrices.filter((_, i) => i !== index),
      },
    });
  };

  const previewBreakdown = useMemo(() => {
    if (!lettersOn || !presetConfig) return null;
    const valid = getValidSizePriceEntries(presetConfig.sizePrices);
    if (valid.length === 0) return null;
    const size = valid[0]!.size;
    try {
      return computePresetCustomizationPrice(presetConfig, {
        text: "A",
        size,
        isOutdoor: false,
        isLedStrip: false,
        isColor: false,
      });
    } catch {
      return null;
    }
  }, [lettersOn, presetConfig]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.presetConfigTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-accent-primary/20 p-4 bg-muted/20">
          <Checkbox
            id="customLettersEnabled"
            checked={lettersOn}
            onCheckedChange={(checked) => setLettersEnabled(checked === true)}
          />
          <div className="space-y-1 min-w-0">
            <Label htmlFor="customLettersEnabled" className="cursor-pointer text-base">
              {t.customLettersToggleLabel}
            </Label>
            <p className="text-xs text-muted-foreground">{t.customLettersToggleHint}</p>
          </div>
        </div>

        {lettersOn && validPairCount === 0 && (
          <p className="text-sm text-destructive" role="status">
            {t.presetLettersInlineWarning}
          </p>
        )}

        {lettersOn ? (
          <>
            <div className="space-y-2">
              <Label>{t.colorsLabel}</Label>
              <div className="flex flex-wrap gap-3">
                {PRESET_COLORS.map((color) => (
                  <div key={color} className="flex items-center gap-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={presetConfig?.colors?.includes(color) ?? false}
                      onCheckedChange={() => toggleColor(color)}
                    />
                    <Label htmlFor={`color-${color}`} className="cursor-pointer flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded border"
                        style={{
                          backgroundColor:
                            color === "white"
                              ? "#fff"
                              : color === "black"
                                ? "#000"
                                : color === "beige"
                                  ? "#d2b48c"
                                  : color === "brown"
                                    ? "#8b4513"
                                    : color,
                        }}
                      />
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.fontsLabel}</Label>
              <div className="flex flex-wrap gap-3">
                {PRESET_FONTS.map((font) => (
                  <div key={font} className="flex items-center gap-2">
                    <Checkbox
                      id={`font-${font}`}
                      checked={presetConfig?.fonts?.includes(font) ?? false}
                      onCheckedChange={() => toggleFont(font)}
                    />
                    <Label htmlFor={`font-${font}`} className="cursor-pointer">
                      {font}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultFont">{t.defaultFontLabel}</Label>
              <Select
                value={presetConfig?.defaultFont}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    custom_config: { ...presetConfig, defaultFont: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(presetConfig?.fonts?.length ? presetConfig.fonts : PRESET_FONTS).map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t.sizesAndPricesLabel}</Label>
              <p className="text-xs text-muted-foreground">{t.sizesAndPricesHint}</p>
              {sizePrices.map((entry, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder={t.sizePlaceholder}
                    value={entry.size}
                    onChange={(e) => updateSizePrice(index, "size", e.target.value)}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={t.pricePlaceholder}
                    value={entry.price || ""}
                    onChange={(e) => updateSizePrice(index, "price", e.target.value)}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => removeSizePrice(index)}>
                    ×
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addSizePrice}>
                {t.add} size
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerCharacter">{t.pricePerCharLabel}</Label>
              <p className="text-xs text-muted-foreground">{t.pricePerCharHint}</p>
              <Input
                id="pricePerCharacter"
                type="number"
                step="0.01"
                min="0"
                placeholder={t.pricePerCharPlaceholder}
                className="w-28"
                value={presetConfig?.pricePerCharacter ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    custom_config: { ...presetConfig, pricePerCharacter: parseFloat(e.target.value) || 0 },
                  })
                }
              />
            </div>

            {validPairCount === 0 ? (
              <p className="text-sm text-muted-foreground rounded-md border border-dashed p-3 bg-muted/10">
                {t.presetPreviewEmpty}
              </p>
            ) : previewBreakdown ? (
              <div className="rounded-md border p-3 bg-muted/20 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">{t.presetPreviewTitle}</p>
                <p className="text-sm">
                  {t.presetPreviewExample
                    .replace("{size}", getValidSizePriceEntries(presetConfig?.sizePrices)[0]?.size ?? "")
                    .replace("{total}", previewBreakdown.totalPrice.toFixed(2))}
                </p>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.optionsOnProductPage}</Label>
              <p className="text-xs text-muted-foreground">{t.optionsOnProductPageHint}</p>
              <div className="flex flex-col gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isOutdoor"
                      checked={presetConfig?.isOutdoor ?? false}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          custom_config: { ...presetConfig, isOutdoor: checked as boolean },
                        })
                      }
                    />
                    <Label htmlFor="isOutdoor" className="cursor-pointer">
                      {t.showOutdoorOption}
                    </Label>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={t.pricePlaceholder}
                    className="w-28"
                    value={presetConfig?.outdoorPrice ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        custom_config: { ...presetConfig, outdoorPrice: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isLedStrip"
                      checked={presetConfig?.isLedStrip ?? false}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          custom_config: { ...presetConfig, isLedStrip: checked as boolean },
                        })
                      }
                    />
                    <Label htmlFor="isLedStrip" className="cursor-pointer">
                      {t.showLedStripOption}
                    </Label>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={t.pricePlaceholder}
                    className="w-28"
                    value={presetConfig?.ledStripPrice ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        custom_config: { ...presetConfig, ledStripPrice: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isColor"
                      checked={presetConfig?.isColor ?? false}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          custom_config: { ...presetConfig, isColor: checked as boolean },
                        })
                      }
                    />
                    <Label htmlFor="isColor" className="cursor-pointer">
                      {t.showColorOption}
                    </Label>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={t.pricePlaceholder}
                    className="w-28"
                    value={presetConfig?.colorPrice ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        custom_config: { ...presetConfig, colorPrice: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
