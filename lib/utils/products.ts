import type { Product, ProductCardData } from "@/types/product";

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
 * Get product display name
 */
export function getProductDisplayName(product: {
  name?: string;
}): string {

  return (product.name ?? "").trim() || "";
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
    category: product.category,
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
    category: (product.category ?? undefined) as Product["category"],
    custom_config: product.custom_config || {},
    featured: product.featured || false,
    seasonal: product_type === "seasonal",
    image: product.images?.[0] || "",
    images: (product.images as string[]) || [],
  };
}
