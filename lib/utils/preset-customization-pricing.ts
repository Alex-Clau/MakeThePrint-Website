import type { CustomProductConfig } from "@/types/product";
import { getPriceForSize } from "@/lib/utils/custom-letters-pricing";

export interface PresetPricingSelection {
  text: string;
  size?: string;
  isOutdoor?: boolean;
  isLedStrip?: boolean;
  isColor?: boolean;
}

export interface PresetPricingBreakdown {
  characterCount: number;
  pricePerCharacter: number;
  lettersTotal: number;
  outdoorAddOn: number;
  ledStripAddOn: number;
  colorAddOn: number;
  totalPrice: number;
}

export function computePresetCustomizationPrice(
  config: CustomProductConfig,
  selection: PresetPricingSelection
): PresetPricingBreakdown {
  const characterCount = selection.text.length;
  const sizePrice = selection.size
    ? getPriceForSize(config.sizePrices, selection.size)
    : 0;
  const pricePerCharacter = sizePrice > 0 ? sizePrice : config.pricePerCharacter ?? 0;
  const lettersTotal = characterCount * pricePerCharacter;
  const outdoorAddOn =
    config.isOutdoor === true && selection.isOutdoor === true
      ? config.outdoorPrice ?? 0
      : 0;
  const ledStripAddOn =
    config.isLedStrip === true && selection.isLedStrip === true
      ? config.ledStripPrice ?? 0
      : 0;
  const colorAddOn =
    config.isColor === true && selection.isColor === true
      ? config.colorPrice ?? 0
      : 0;
  const totalPrice = lettersTotal + outdoorAddOn + ledStripAddOn + colorAddOn;

  return {
    characterCount,
    pricePerCharacter,
    lettersTotal,
    outdoorAddOn,
    ledStripAddOn,
    colorAddOn,
    totalPrice,
  };
}
