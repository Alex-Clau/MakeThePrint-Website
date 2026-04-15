/**
 * Normalizes catalog `search` query params (URL / API): trim, empty → null, max length.
 * Used server-side before applying Supabase filters.
 */
export function normalizeCatalogSearchInput(
  raw: string | undefined | null
): string | null {
  if (raw == null) return null;
  const t = String(raw).trim();
  if (!t) return null;
  const max = 120;
  return t.length > max ? t.slice(0, max) : t;
}
