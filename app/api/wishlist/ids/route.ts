import { connection, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWishlistProductIds } from "@/lib/supabase/wishlist";

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

    const ids = await getWishlistProductIds(user.id);
    return NextResponse.json({ productIds: Array.from(ids) });
  } catch (err) {
    console.error("[api/wishlist/ids]", err);
    return NextResponse.json({ productIds: [] });
  }
}
