/**
 * Pricing structure for indoor custom letters based on size (in RON)
 * Based on the provided pricing chart
 */
export const INDOOR_SIZE_PRICING = {
  5: { min: 15, max: 20, average: 17.5 },
  10: { min: 35, max: 45, average: 40 },
  15: { min: 65, max: 80, average: 72.5 },
  20: { min: 120, max: 150, average: 135 },
  24: { min: 190, max: 240, average: 215 },
} as const;

/**
 * Pricing structure for outdoor custom letters based on size (in RON)
 * Higher quality, weather-resistant material - priced higher than indoor
 */
export const OUTDOOR_SIZE_PRICING = {
  5: { min: 20, max: 25, average: 22.5 }, // ~28% more expensive
  10: { min: 45, max: 58, average: 51.5 }, // ~28% more expensive
  15: { min: 83, max: 102, average: 92.5 }, // ~28% more expensive
  20: { min: 154, max: 192, average: 173 }, // ~28% more expensive
  24: { min: 243, max: 307, average: 275 }, // ~28% more expensive
} as const;

/**
 * Check if product is outdoor based on product name
 * @param productName - Product name
 * @returns true if outdoor, false if indoor
 */
export function isOutdoorProduct(productName: string): boolean {
  return productName.toLowerCase().includes("outdoor");
}

/**
 * Get price per character based on letter height in cm and product type
 * @param sizeCm - Letter height in centimeters (5, 10, 15, 20, or 24)
 * @param isOutdoor - Whether the product is for outdoor use
 * @returns Price per character in RON
 */
export function getPricePerCharacter(sizeCm: number, isOutdoor: boolean = false): number {
  const pricing = isOutdoor 
    ? OUTDOOR_SIZE_PRICING[sizeCm as keyof typeof OUTDOOR_SIZE_PRICING]
    : INDOOR_SIZE_PRICING[sizeCm as keyof typeof INDOOR_SIZE_PRICING];
    
  if (!pricing) {
    // Fallback to 10cm pricing if size not found
    const fallbackPricing = isOutdoor ? OUTDOOR_SIZE_PRICING[10] : INDOOR_SIZE_PRICING[10];
    return fallbackPricing.average;
  }
  return pricing.average;
}

/**
 * Calculate total price for custom letters
 * @param text - The text to be printed
 * @param sizeCm - Letter height in centimeters
 * @param isOutdoor - Whether the product is for outdoor use
 * @returns Total price in RON
 */
export function calculateCustomLettersPrice(
  text: string, 
  sizeCm: number, 
  isOutdoor: boolean = false
): number {
  const characterCount = text.length;
  const pricePerCharacter = getPricePerCharacter(sizeCm, isOutdoor);
  return characterCount * pricePerCharacter;
}

