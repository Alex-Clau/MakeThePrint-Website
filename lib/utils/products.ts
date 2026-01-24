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
    featured: product.featured,
    // Rating will be calculated dynamically from reviews when needed
    rating: undefined,
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
    stock_quantity: product.stock_quantity || 0,
    product_type: product.product_type || "standard",
    custom_config: product.custom_config || {},
    image: product.images?.[0] || "",
    images: (product.images as string[]) || [],
  };
}

