/**
 * Page parameter types for Next.js routes
 */

export interface ProductPageParams {
  params: Promise<{
    id: string;
  }>;
}

