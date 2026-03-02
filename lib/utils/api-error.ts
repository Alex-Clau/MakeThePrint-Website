import { NextResponse } from "next/server";
import { getUserFriendlyError } from "./error-messages";

/** Standard API error response shape */
export type ApiErrorBody = { error: string; code?: string };

/** Create a JSON error response with optional code for client behavior (e.g. UNAUTHORIZED, NOT_FOUND). */
export function apiErrorResponse(
  message: string,
  status: number,
  code?: string
): NextResponse<ApiErrorBody> {
  const body: ApiErrorBody = { error: message };
  if (code) body.code = code;
  return NextResponse.json(body, { status });
}

/** Parse error body from a failed fetch response. Use when !res.ok. */
export async function getApiErrorBody(
  response: Response
): Promise<{ message: string; code?: string }> {
  const body = await response.json().catch(() => ({}));
  const data = body as { error?: string; code?: string };
  return {
    message: data?.error ?? "Request failed",
    code: data?.code,
  };
}

/** Normalize unknown caught errors to a user-friendly message (and optional code). Use in API route catch blocks. */
export function normalizeToApiError(error: unknown): {
  message: string;
  code?: string;
} {
  const message =
    error instanceof Error ? error.message : getUserFriendlyError(error);
  return { message };
}
