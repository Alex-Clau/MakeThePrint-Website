/**
 * Convert technical database errors into user-friendly messages
 */
export function getUserFriendlyError(error: any): string {
  if (!error) return "An unexpected error occurred. Please try again.";

  const errorMessage = error?.message || error?.error_description || String(error);
  const lowerMessage = errorMessage.toLowerCase();

  // Row-Level Security (RLS) policy violations
  if (
    lowerMessage.includes("row-level security") ||
    lowerMessage.includes("row-level-security") ||
    lowerMessage.includes("violates row-level security policy") ||
    lowerMessage.includes("new row violates row-level security policy")
  ) {
    return "You don't have permission to perform this action. Please ensure you're signed in and try again.";
  }

  // Foreign key violations
  if (
    lowerMessage.includes("foreign key") ||
    lowerMessage.includes("violates foreign key constraint")
  ) {
    return "This item is no longer available or has been removed.";
  }

  // Unique constraint violations
  if (
    lowerMessage.includes("unique constraint") ||
    lowerMessage.includes("duplicate key") ||
    lowerMessage.includes("already exists")
  ) {
    return "This item already exists. Please refresh the page and try again.";
  }

  // Permission denied
  if (
    lowerMessage.includes("permission denied") ||
    lowerMessage.includes("access denied") ||
    lowerMessage.includes("insufficient privileges")
  ) {
    return "You don't have permission to perform this action.";
  }

  // Network/connection errors
  if (
    lowerMessage.includes("network") ||
    lowerMessage.includes("connection") ||
    lowerMessage.includes("timeout") ||
    lowerMessage.includes("fetch failed")
  ) {
    return "Network error. Please check your connection and try again.";
  }

  // Authentication errors
  if (
    lowerMessage.includes("jwt") ||
    lowerMessage.includes("token") ||
    lowerMessage.includes("unauthorized") ||
    lowerMessage.includes("not authenticated")
  ) {
    return "Please sign in to continue.";
  }

  // Validation errors (keep some user-friendly ones)
  if (
    lowerMessage.includes("required") ||
    lowerMessage.includes("invalid") ||
    lowerMessage.includes("must be")
  ) {
    // Check if it's already user-friendly
    if (
      !lowerMessage.includes("constraint") &&
      !lowerMessage.includes("violates") &&
      !lowerMessage.includes("policy")
    ) {
      return errorMessage;
    }
  }

  // Default: generic user-friendly message for technical errors
  return "Something went wrong. Please try again or contact support if the problem persists.";
}

