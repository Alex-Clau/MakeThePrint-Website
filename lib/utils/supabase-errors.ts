/**
 * Convert Supabase errors to plain Error objects for serialization
 * This prevents Next.js serialization errors when errors are thrown from Server Components
 */
export function handleSupabaseError(error: any): Error {
  if (error instanceof Error) {
    // If it's already a plain Error, return it
    return error;
  }
  
  // Convert Supabase error to plain Error with just the message
  const message = error?.message || error?.error_description || "An unexpected error occurred";
  return new Error(message);
}

