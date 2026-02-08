import type { Locale } from "@/lib/i18n";
import { ProductCardData } from "@/types/product";

/**
 * Get product display name for the given locale.
 * Uses name_ro when locale is "ro" (fallback to name); otherwise uses name.
 */
export function getProductDisplayName(
  product: { name?: string; name_ro?: string | null },
  locale: Locale
): string {
  if (locale === "ro" && product.name_ro?.trim()) {
    return product.name_ro.trim();
  }
  return (product.name ?? "").trim() || "";
}

/**
 * Transform database product to ProductCardData format.
 * Pass locale to resolve name from name (EN) / name_ro (RO).
 */
export function transformProductToCardData(
  product: any,
  locale?: Locale
): ProductCardData {
  const name =
    locale !== undefined
      ? getProductDisplayName(product, locale)
      : (product.name ?? "").trim();
  return {
    id: product.id,
    name: name || (product.name ?? ""),
    price: parseFloat(product.price),
    image: product.images?.[0] || "",
    category: product.category,
    featured: product.featured,
    ...(product.rating != null && { rating: product.rating }),
    ...(product.review_count !== undefined && { review_count: product.review_count }),
  };
}

/**
 * Transform database product to ProductWithImage format (keeps name_ro for display).
 */
export function transformProductToFull(product: any) {
  return {
    id: product.id,
    name: product.name,
    name_ro: product.name_ro ?? undefined,
    description: product.description || "",
    price: parseFloat(product.price),
    material_options: (product.material_options as string[]) || [],
    product_type: product.product_type || "custom",
    category: product.category || "",
    custom_config: product.custom_config || {},
    featured: product.featured || false,
    seasonal: product.seasonal || false,
    image: product.images?.[0] || "",
    images: (product.images as string[]) || [],
  };
}

