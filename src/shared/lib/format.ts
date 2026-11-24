/** True when a value is worth showing (not null/empty). */
export function hasValue<T>(v: T | null | undefined | ''): v is T {
  if (v === null || v === undefined || v === '') return false;
  if (Array.isArray(v) && v.length === 0) return false;
  return true;
}

export function money(n: number | null | undefined): string | null {
  if (typeof n !== 'number') return null;
  return (n < 0 ? '-$' : '$') + Math.round(Math.abs(n)).toLocaleString('en-US');
}

export function priceRange(min: number | null | undefined, max: number | null | undefined): string | null {
  if (typeof min !== 'number') return money(max);
  if (typeof max !== 'number' || min === max) return money(min);
  return `${money(min)} – ${money(max)}`;
}

export function joinList(v: string[] | string | null | undefined, sep = ', '): string | null {
  if (Array.isArray(v)) return v.length ? v.join(sep) : null;
  return v ?? null;
}

export function compact<T>(values: (T | null | undefined | false | '')[]): T[] {
  return values.filter(Boolean) as T[];
}

export function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
