import { connection, NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOrdersPage } from "@/lib/supabase/orders";
import { apiErrorResponse, normalizeToApiError } from "@/lib/utils/api-error";

const DEFAULT_PAGE_SIZE = 8;
const MAX_PAGE_SIZE = 32;

export async function GET(request: NextRequest) {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return apiErrorResponse("Neautorizat", 401, "UNAUTHORIZED");
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const rawSize = parseInt(searchParams.get("page_size") ?? String(DEFAULT_PAGE_SIZE), 10);
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, Number.isFinite(rawSize) ? rawSize : DEFAULT_PAGE_SIZE)
    );

    const { orders, hasMore } = await getOrdersPage({ userId: user.id, page, pageSize });
    return NextResponse.json({ orders, hasMore, page, pageSize });
  } catch (error: unknown) {
    const { message } = normalizeToApiError(error);
    return apiErrorResponse(message, 500);
  }
}
