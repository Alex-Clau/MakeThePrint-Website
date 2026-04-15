import { computePresetCustomizationPrice } from "@/lib/utils/preset-customization-pricing";
import { isPresetCustomLettersProduct } from "@/lib/utils/preset-letter-config";
import type { CartCustomizations } from "@/types/cart";
import type { CustomProductConfig } from "@/types/product";

type PricingProduct = {
  price: number;
  category?: unknown;
  custom_config?: unknown;
};

export function resolveServerCartUnitPrice(
  product: PricingProduct,
  customizations?: CartCustomizations
): number {
  const customConfig = product.custom_config;

  if (isPresetCustomLettersProduct(product.category as string | undefined, customConfig)) {
    const text =
      typeof customizations?.text === "string" ? customizations.text : "";
    const size =
      typeof customizations?.size === "string" ? customizations.size : "";

    const pricing = computePresetCustomizationPrice(customConfig as CustomProductConfig, {
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
