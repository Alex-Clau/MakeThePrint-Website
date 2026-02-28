"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { messages } from "@/lib/messages";
import { PRESET_COLORS, PRESET_FONTS } from "@/lib/constants/preset-options";
import type { ProductFormData } from "./admin-product-form-types";

interface AdminPresetConfigCardProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export function AdminPresetConfigCard({ formData, setFormData }: AdminPresetConfigCardProps) {
  const t = messages.admin;

  const toggleColor = (color: string) => {
    const current = formData.custom_config?.colors || [];
    const next = current.includes(color) ? current.filter((c) => c !== color) : [...current, color];
    setFormData({
      ...formData,
      custom_config: { ...formData.custom_config, colors: next },
    });
  };

  const toggleFont = (font: string) => {
    const current = formData.custom_config?.fonts || [];
    const next = current.includes(font) ? current.filter((f) => f !== font) : [...current, font];
    setFormData({
      ...formData,
      custom_config: { ...formData.custom_config, fonts: next },
    });
  };

  const sizePrices = formData.custom_config?.sizePrices || [];
  const addSizePrice = () => {
    setFormData({
      ...formData,
      custom_config: {
        ...formData.custom_config,
        sizePrices: [...sizePrices, { size: "", price: 0 }],
      },
    });
  };
  const updateSizePrice = (index: number, field: "size" | "price", value: string | number) => {
    const next = [...sizePrices];
    next[index] = { ...next[index], [field]: field === "price" ? Number(value) : value };
    setFormData({
      ...formData,
      custom_config: { ...formData.custom_config, sizePrices: next },
    });
  };
  const removeSizePrice = (index: number) => {
    setFormData({
      ...formData,
      custom_config: {
        ...formData.custom_config,
        sizePrices: sizePrices.filter((_, i) => i !== index),
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.presetConfigTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t.colorsLabel}</Label>
          <div className="flex flex-wrap gap-3">
            {PRESET_COLORS.map((color) => (
              <div key={color} className="flex items-center gap-2">
                <Checkbox
                  id={`color-${color}`}
                  checked={formData.custom_config?.colors?.includes(color) ?? false}
                  onCheckedChange={() => toggleColor(color)}
                />
                <Label htmlFor={`color-${color}`} className="cursor-pointer flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded border"
                    style={{
                      backgroundColor:
                        color === "white" ? "#fff" : color === "black" ? "#000" : color === "beige" ? "#d2b48c" : color === "brown" ? "#8b4513" : color,
                    }}
                  />
                  {color}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Fonts (select from list)</Label>
          <div className="flex flex-wrap gap-3">
            {PRESET_FONTS.map((font) => (
              <div key={font} className="flex items-center gap-2">
                <Checkbox
                  id={`font-${font}`}
                  checked={formData.custom_config?.fonts?.includes(font) ?? false}
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
            value={formData.custom_config?.defaultFont}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                custom_config: { ...formData.custom_config, defaultFont: value },
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(formData.custom_config?.fonts?.length ? formData.custom_config.fonts : PRESET_FONTS).map((font) => (
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
          <p className="text-xs text-muted-foreground">
            {t.pricePerCharHint}
          </p>
          <Input
            id="pricePerCharacter"
            type="number"
            step="0.01"
            min="0"
            placeholder={t.pricePerCharPlaceholder}
            className="w-28"
            value={formData.custom_config?.pricePerCharacter ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                custom_config: { ...formData.custom_config, pricePerCharacter: parseFloat(e.target.value) || 0 },
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">{t.optionsOnProductPage}</Label>
          <p className="text-xs text-muted-foreground">{t.optionsOnProductPageHint}</p>
          <div className="flex flex-col gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isOutdoor"
                  checked={formData.custom_config?.isOutdoor ?? false}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      custom_config: { ...formData.custom_config, isOutdoor: checked as boolean },
                    })
                  }
                />
                <Label htmlFor="isOutdoor" className="cursor-pointer">{t.showOutdoorOption}</Label>
              </div>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder={t.pricePlaceholder}
                className="w-28"
                value={formData.custom_config?.outdoorPrice ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    custom_config: { ...formData.custom_config, outdoorPrice: parseFloat(e.target.value) || 0 },
                  })
                }
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isLedStrip"
                  checked={formData.custom_config?.isLedStrip ?? false}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      custom_config: { ...formData.custom_config, isLedStrip: checked as boolean },
                    })
                  }
                />
                <Label htmlFor="isLedStrip" className="cursor-pointer">{t.showLedStripOption}</Label>
              </div>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder={t.pricePlaceholder}
                className="w-28"
                value={formData.custom_config?.ledStripPrice ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    custom_config: { ...formData.custom_config, ledStripPrice: parseFloat(e.target.value) || 0 },
                  })
                }
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isColor"
                  checked={formData.custom_config?.isColor ?? false}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      custom_config: { ...formData.custom_config, isColor: checked as boolean },
                    })
                  }
                />
                <Label htmlFor="isColor" className="cursor-pointer">{t.showColorOption}</Label>
              </div>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder={t.pricePlaceholder}
                className="w-28"
                value={formData.custom_config?.colorPrice ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    custom_config: { ...formData.custom_config, colorPrice: parseFloat(e.target.value) || 0 },
                  })
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
