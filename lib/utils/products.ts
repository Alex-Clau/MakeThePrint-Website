import { ProductCardData } from "@/types/product";

/**
 * Transform database product to ProductCardData format
 */
export function transformProductToCardData(product: any): ProductCardData {
  return {
    id: product.id,
    name: product.name,
    price: parseFloat(product.price),
    image: product.images?.[0] || "",
    category: product.category,
    featured: product.featured,
    // Rating and review count will be calculated dynamically from reviews when needed
    ...(product.rating && {rating: product.rating}),
    ...(product.review_count !== undefined && {review_count: product.review_count}),
  };
}

/**
 * Transform database product to ProductWithImage format
 */
export function transformProductToFull(product: any) {
  return {
    id: product.id,
    name: product.name,
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

