import type { CustomProductConfig } from "@/types/product";

/**
 * Get price for a given size from product config (admin-defined).
 * sizePrices can be an array of { size, price } or a record of size -> price.
 * Returns 0 if size not found.
 */
export function getPriceForSize(
  sizePrices: CustomProductConfig["sizePrices"],
  sizeLabel: string
): number {
  if (!sizePrices) return 0;
  if (Array.isArray(sizePrices)) {
    const entry = sizePrices.find(
      (e) => e.size.toLowerCase().trim() === sizeLabel.toLowerCase().trim()
    );
    return entry?.price ?? 0;
  }
  const key = Object.keys(sizePrices).find(
    (k) => k.toLowerCase().trim() === sizeLabel.toLowerCase().trim()
  );
  return key ? sizePrices[key] : 0;
}

/**
 * Get list of size labels from product config (admin-defined).
 */
export function getSizeLabels(sizePrices: CustomProductConfig["sizePrices"]): string[] {
  if (!sizePrices) return [];
  if (Array.isArray(sizePrices)) {
    return sizePrices.map((e) => e.size).filter(Boolean);
  }
  return Object.keys(sizePrices).filter(Boolean);
}
