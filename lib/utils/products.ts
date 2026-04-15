import type {
  CustomProductConfig,
  Product,
  ProductCardData,
} from "@/types/product";

type ProductRowForCard = Pick<
  Product,
  "id" | "category" | "featured" | "images"
> & {
  name: string;
  price: number | string;
  rating?: number;
  review_count?: number;
};

type ProductRowForFull = Pick<
  Product,
  "id" | "name" | "description" | "product_type" | "category" | "custom_config" | "featured" | "images"
> & {
  price: number | string;
};

/**
 * Get product display name (empty string if missing or null product).
 */
export function getProductDisplayName(
  product: { name?: string } | null | undefined
): string {
  if (product == null) return "";
  return (product.name ?? "").trim() || "";
}

export function isPresetLettersConfig(
  config: Product["custom_config"]
): config is CustomProductConfig {
  if (!config || typeof config !== "object") return false;
  return "fonts" in config || "defaultFont" in config || "sizePrices" in config;
}

/**
 * Normalize DB / CMS category strings so storefront logic stays consistent
 * (e.g. accidental whitespace or different casing).
 */
export function normalizeProductCategory(
  category: string | null | undefined
): Product["category"] | undefined {
  if (category == null) return undefined;
  const c = String(category).trim().toLowerCase();

  if (c === "preset" || c === "inquire" || c === "finished") {
    return c;
  }
  return undefined;
}

/** Categories that sell via contact / WhatsApp (matches product detail purchase flow). */
export function isInquiryCategory(category: string | undefined): boolean {
  return normalizeProductCategory(category) === "inquire";
}

/** Admin “base / reference” price for inquiry items: show on storefront only when set. */
export function hasInquiryDisplayPrice(price: number): boolean {
  return Number.isFinite(price) && price > 0;
}

/**
 * Transform database product to ProductCardData format.
 */
export function transformProductToCardData(product: ProductRowForCard): ProductCardData {
  const name = getProductDisplayName(product) || product.name;
  return {
    id: product.id,
    name,
    price: parseFloat(String(product.price)),
    image: product.images?.[0] || "",
    category: normalizeProductCategory(product.category as string | undefined),
    featured: product.featured,
    ...(product.rating != null && { rating: product.rating }),
    ...(product.review_count !== undefined && { review_count: product.review_count }),
  };
}

/**
 * Transform database product to ProductWithImage format
 */
export function transformProductToFull(product: ProductRowForFull) {
  const product_type = product.product_type || "custom";
  return {
    id: product.id,
    name: product.name,
    description: product.description || "",
    price: parseFloat(String(product.price)),
    product_type,
    category: normalizeProductCategory(product.category as string | undefined),
    custom_config: product.custom_config || {},
    featured: product.featured || false,
    seasonal: product_type === "seasonal",
    image: product.images?.[0] || "",
    images: (product.images as string[]) || [],
  };
}
