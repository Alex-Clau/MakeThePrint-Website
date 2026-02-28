import { createClient } from "./server";

export interface DashboardStats {
  productsCount: number;
  ordersCount: number;
  customProductsCount: number;
  seasonalProductsCount: number;
}

/**
 * Fetch counts for the admin dashboard (products, orders, custom/seasonal breakdown).
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [productsRes, ordersRes, customRes, seasonalRes] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("product_type", "custom"),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("product_type", "seasonal"),
  ]);

  return {
    productsCount: productsRes.count ?? 0,
    ordersCount: ordersRes.count ?? 0,
    customProductsCount: customRes.count ?? 0,
    seasonalProductsCount: seasonalRes.count ?? 0,
  };
}
