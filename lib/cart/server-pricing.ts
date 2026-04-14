import { computePresetCustomizationPrice } from "@/lib/utils/preset-customization-pricing";
import { isPresetLettersConfig } from "@/lib/utils/products";
import type { CartCustomizations } from "@/types/cart";

type PricingProduct = {
  price: number;
  category?: unknown;
  custom_config?: unknown;
};

export function resolveServerCartUnitPrice(
  product: PricingProduct,
  customizations?: CartCustomizations
): number {
  const customConfig = product.custom_config as Parameters<
    typeof isPresetLettersConfig
  >[0];

  if (
    product.category === "preset" &&
    isPresetLettersConfig(customConfig)
  ) {
    const text =
      typeof customizations?.text === "string" ? customizations.text : "";
    const size =
      typeof customizations?.size === "string" ? customizations.size : "";

    const pricing = computePresetCustomizationPrice(customConfig, {
      text,
      size,
      isOutdoor: customizations?.isOutdoor === true,
      isLedStrip: customizations?.isLedStrip === true,
      isColor: customizations?.isColor === true,
    });
    return pricing.totalPrice;
  }

  return Number(product.price ?? 0);
}
