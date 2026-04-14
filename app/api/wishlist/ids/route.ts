import { connection, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWishlistProductIds } from "@/lib/supabase/wishlist";
import { apiErrorResponse, normalizeToApiError } from "@/lib/utils/api-error";

export async function GET() {
  await connection();
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ productIds: [] });
    }

    const ids = await getWishlistProductIds(user.id, supabase);
    return NextResponse.json({ productIds: Array.from(ids) });
  } catch (err) {
    console.error("[api/wishlist/ids]", err);
    const { message } = normalizeToApiError(err);
    return apiErrorResponse(message, 500);
  }
}
