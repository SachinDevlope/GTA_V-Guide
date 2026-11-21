import type { ModeFilter } from '@/shared/types';
import type { CardModel, SortDef } from '../types';

export const inMode = (card: CardModel, mode: ModeFilter) => mode === 'all' || card.modes.includes(mode);

/** Distinct facet values present in a set of cards, sorted naturally. */
export function facetValues(cards: CardModel[], key: string): string[] {
  const set = new Set<string>();
  for (const c of cards) for (const v of c.facets[key] ?? []) set.add(v);
  return [...set].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export function applyFilters(cards: CardModel[], filters: Record<string, string>): CardModel[] {
  const active = Object.entries(filters).filter(([, v]) => v);
  if (!active.length) return cards;
  return cards.filter((c) => active.every(([k, v]) => (c.facets[k] ?? []).includes(v)));
}

/** Sorts by a declared sort; missing values always go last. */
export function sortCards(cards: CardModel[], sort: SortDef | undefined): CardModel[] {
  if (!sort) return cards;
  const dir = sort.dir === 'asc' ? 1 : -1;
  const pool = sort.onlyWithValue ? cards.filter((c) => c.sortValues[sort.key] != null) : cards;
  return pool.slice().sort((a, b) => {
    const x = a.sortValues[sort.key];
    const y = b.sortValues[sort.key];
    if (x == null && y == null) return 0;
    if (x == null) return 1;
    if (y == null) return -1;
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * dir;
    return String(x).localeCompare(String(y)) * dir;
  });
}

/** Facet values with how many cards have each one, for filter menus. */
export function facetOptions(cards: CardModel[], key: string): { value: string; label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const c of cards) for (const v of c.facets[key] ?? []) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
    .map(([value, count]) => ({ value, label: value, count }));
}
