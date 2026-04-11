/**
 * Canonical site origin for metadata, redirects, and other absolute URLs.
 * Prefer NEXT_PUBLIC_SITE_URL in all environments when set.
 */
export function getSiteOrigin(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL).origin;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return "https://maketheprint.store";
}
