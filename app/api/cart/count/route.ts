import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiErrorResponse, normalizeToApiError } from "@/lib/utils/api-error";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    const { count, error } = await supabase
      .from("cart")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ count: count ?? 0 }, { status: 200 });
  } catch (error: unknown) {
    const { message } = normalizeToApiError(error);
    return apiErrorResponse(message, 500);
  }
}

