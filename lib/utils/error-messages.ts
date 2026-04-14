import { messages } from "@/lib/messages";

function rawErrorMessage(error: unknown): string {
  if (error == null) return "";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object") {
    const o = error as Record<string, unknown>;
    if (typeof o.message === "string") return o.message;
    if (typeof o.error_description === "string") return o.error_description;
  }
  return String(error);
}

/**
 * Map technical/database errors to user-facing copy (Romanian via `messages`).
 */
export function getUserFriendlyError(error: unknown): string {
  const e = messages.errors;
  if (error == null || error === "") return e.unexpected;

  const errorMessage = rawErrorMessage(error);
  const lowerMessage = errorMessage.toLowerCase();

  if (
    lowerMessage.includes("row-level security") ||
    lowerMessage.includes("row-level-security") ||
    lowerMessage.includes("violates row-level security policy") ||
    lowerMessage.includes("new row violates row-level security policy")
  ) {
    return e.rls;
  }

  if (
    lowerMessage.includes("foreign key") ||
    lowerMessage.includes("violates foreign key constraint")
  ) {
    return e.foreignKey;
  }

  if (
    lowerMessage.includes("unique constraint") ||
    lowerMessage.includes("duplicate key") ||
    lowerMessage.includes("already exists")
  ) {
    return e.unique;
  }

  if (
    lowerMessage.includes("permission denied") ||
    lowerMessage.includes("access denied") ||
    lowerMessage.includes("insufficient privileges")
  ) {
    return e.permission;
  }

  if (
    lowerMessage.includes("network") ||
    lowerMessage.includes("connection") ||
    lowerMessage.includes("timeout") ||
    lowerMessage.includes("fetch failed")
  ) {
    return e.network;
  }

  if (
    lowerMessage.includes("jwt") ||
    lowerMessage.includes("token") ||
    lowerMessage.includes("unauthorized") ||
    lowerMessage.includes("not authenticated")
  ) {
    return e.signIn;
  }

  if (
    lowerMessage.includes("required") ||
    lowerMessage.includes("invalid") ||
    lowerMessage.includes("must be")
  ) {
    if (
      !lowerMessage.includes("constraint") &&
      !lowerMessage.includes("violates") &&
      !lowerMessage.includes("policy")
    ) {
      return errorMessage;
    }
  }

  return e.generic;
}
