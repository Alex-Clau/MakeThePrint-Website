/**
 * Convert Supabase errors to plain Error objects for serialization
 * This prevents Next.js serialization errors when errors are thrown from Server Components
 */
export function handleSupabaseError(error: unknown): Error {
  if (error instanceof Error) {
    // If it's already a plain Error, return it
    return error;
  }
  
  // Convert Supabase error to plain Error with just the message
  const message =
    (typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string" &&
      (error as { message: string }).message) ||
    (typeof error === "object" &&
      error !== null &&
      "error_description" in error &&
      typeof (error as { error_description: unknown }).error_description === "string" &&
      (error as { error_description: string }).error_description) ||
    "An unexpected error occurred";
  return new Error(message);
}

