import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "./server";

/**
 * Admin client with service role (bypasses RLS). Use only in server/API code.
 * Never expose to the client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

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
  const supabase = await createServerClient();

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
