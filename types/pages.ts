/**
 * Page parameter types for Next.js routes
 */

export interface ProductPageParams {
  params: Promise<{
    id: string;
  }>;
}

export interface CategoryPageParams {
  params: Promise<{
    slug: string;
  }>;
}

