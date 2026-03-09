import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWishlistProductIds } from "@/lib/supabase/wishlist";

export async function GET() {
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
  } catch {
    return NextResponse.json({ productIds: [] });
  }
}
