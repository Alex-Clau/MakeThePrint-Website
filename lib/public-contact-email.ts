/**
 * Public marketing / contact address shown on the site (mailto, etc.).
 * Set `NEXT_PUBLIC_EMAIL` in the environment (e.g. contact@yourdomain.com).
 */
export function getPublicContactEmail(): string {
  return (process.env.NEXT_PUBLIC_EMAIL ?? "").trim();
}
