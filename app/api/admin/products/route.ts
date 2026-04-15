import { connection, NextRequest, NextResponse } from "next/server";
import { assertAdminUser } from "@/lib/auth/assert-admin-user";
import { getAdminProductsPage } from "@/lib/supabase/products";
import { apiErrorResponse, normalizeToApiError } from "@/lib/utils/api-error";

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 48;

export async function GET(request: NextRequest) {
  await connection();
  const guard = await assertAdminUser();
  if (!guard.ok) {
    return apiErrorResponse(
      guard.status === 401 ? "Neautorizat" : "Acces refuzat",
      guard.status,
      guard.status === 401 ? "UNAUTHORIZED" : "FORBIDDEN"
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const rawSize = parseInt(
      searchParams.get("page_size") ?? String(DEFAULT_PAGE_SIZE),
      10
    );
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, Number.isFinite(rawSize) ? rawSize : DEFAULT_PAGE_SIZE)
    );
    const type = searchParams.get("type") ?? undefined;
    const category = searchParams.get("category") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const { products, hasMore } = await getAdminProductsPage({
      page,
      pageSize,
      ...(type ? { type } : {}),
      ...(category ? { category } : {}),
      ...(search ? { search } : {}),
    });

    return NextResponse.json({ products, hasMore, page, pageSize });
  } catch (error: unknown) {
    const { message } = normalizeToApiError(error);
    return apiErrorResponse(message, 500);
  }
}
