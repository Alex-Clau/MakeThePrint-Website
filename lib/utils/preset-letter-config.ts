import type { CustomProductConfig, Product, SizePriceEntry } from "@/types/product";
import { isPresetLettersConfig, normalizeProductCategory } from "@/lib/utils/products";

/**
 * Custom letter UI and pricing are enabled. `undefined` / missing means on (legacy products).
 */
export function presetCustomLettersEnabled(
  config: CustomProductConfig | null | undefined
): boolean {
  if (!config || typeof config !== "object") return false;
  return config.customLettersEnabled !== false;
}

export function isValidSizePriceEntry(entry: unknown): entry is SizePriceEntry {
  if (!entry || typeof entry !== "object") return false;
  const e = entry as { size?: unknown; price?: unknown };
  const size = typeof e.size === "string" ? e.size.trim() : "";
  if (!size) return false;
  const price = Number(e.price);
  return Number.isFinite(price) && price > 0;
}

export function getValidSizePriceEntries(
  sizePrices: CustomProductConfig["sizePrices"] | undefined
): SizePriceEntry[] {
  if (!Array.isArray(sizePrices)) return [];
  return sizePrices.filter(isValidSizePriceEntry);
}

export function countValidSizePricePairs(
  config: CustomProductConfig | undefined
): number {
  return getValidSizePriceEntries(config?.sizePrices).length;
}

/** Preset product that shows the full letter builder and uses customization pricing. */
export function isPresetCustomLettersProduct(
  category: string | undefined,
  config: unknown
): boolean {
  const cfg = config as Product["custom_config"];
  return (
    normalizeProductCategory(category) === "preset" &&
    isPresetLettersConfig(cfg) &&
    presetCustomLettersEnabled(cfg as CustomProductConfig)
  );
}
