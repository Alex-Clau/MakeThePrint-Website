/**
 * Restrict post-auth redirects to same-origin relative paths (OAuth `next` param).
 */
export function safeRedirectPath(next: string | null | undefined, fallback: string): string {
  if (next == null || next === "") return fallback;
  const trimmed = next.trim();
  if (!trimmed.startsWith("/")) return fallback;
  if (trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("://")) return fallback;
  if (trimmed.includes("\\")) return fallback;
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) return fallback;
  return trimmed;
}
