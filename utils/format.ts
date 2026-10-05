/** Format money strings from API ("2750.00") for UI. */
export function formatMoney(value: string | number | null | undefined): string {
  if (value == null || value === '') return '—';
  const num = typeof value === 'number' ? value : Number.parseFloat(String(value).replace(',', '.'));
  if (!Number.isFinite(num)) return String(value);
  return `${num.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} с`;
}

export function formatRating(rating: number | null | undefined, count?: number): string {
  if (rating == null) return 'Нет оценок';
  const base = rating.toFixed(1);
  if (count == null) return base;
  return `${base} · ${count}`;
}

/** pluralRu(5, ['товар', 'товара', 'товаров']) → 'товаров' */
export function pluralRu(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

export function pickImageUrl(
  cover: string | null | undefined,
  images?: Array<{ card?: string | null; thumb?: string | null; original?: string | null }>,
): string | null {
  if (cover) return cover;
  const first = images?.[0];
  if (!first) return null;
  return first.card || first.thumb || first.original || null;
}
