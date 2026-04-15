import { connection, NextRequest, NextResponse } from "next/server";
import { fetchCustomProductCardsPage } from "@/lib/catalog/fetch-custom-product-cards-page";
import { apiErrorResponse, normalizeToApiError } from "@/lib/utils/api-error";

const DEFAULT_PAGE_SIZE = 8;
const MAX_PAGE_SIZE = 24;

export async function GET(request: NextRequest) {
  await connection();
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const rawSize = parseInt(
      searchParams.get("page_size") ?? String(DEFAULT_PAGE_SIZE),
      10,
    );
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, Number.isFinite(rawSize) ? rawSize : DEFAULT_PAGE_SIZE),
    );
    const search = searchParams.get("search") ?? undefined;

    const { products, hasMore } = await fetchCustomProductCardsPage({
      page,
      pageSize,
      ...(search ? { search } : {}),
    });

    return NextResponse.json({ products, hasMore, page, pageSize });
  } catch (error: unknown) {
    const { message } = normalizeToApiError(error);
    return apiErrorResponse(message, 500);
  }
}
