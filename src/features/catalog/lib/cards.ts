import { normalize, toSearchFields } from '@/features/search/lib/normalize';
import { hasValue } from '@/shared/lib/format';
import { CATEGORIES, CATEGORY_KEYS } from '../registry';
import type { BaseItem, CardModel, CategoryDefinition, CategoryKey } from '../types';
import { imageFor } from './images';

export const itemHref = (cat: CategoryKey, id: string) => `/${cat}/${encodeURIComponent(id)}`;

/** Builds the serializable card for one item. Runs on the server. */
export function toCard(def: CategoryDefinition<BaseItem>, item: BaseItem): CardModel {
  const facets: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(def.facets?.(item) ?? {})) {
    const vals = (Array.isArray(v) ? v : [v]).filter(hasValue).map(String);
    if (vals.length) facets[k] = vals;
  }
  const sortValues: Record<string, number | string | null> = { name: item.name };
  for (const [k, v] of Object.entries(def.sortValues?.(item) ?? {})) sortValues[k] = v ?? null;
  const modes = def.modes(item);
  const full = def.rating?.(item) ?? null;
  const rating = full ? { stars: full.stars, basis: full.basis } : null;
  if (rating) sortValues.rating = rating.stars;
  return {
    key: `${def.key}/${item.id}`,
    href: itemHref(def.key, item.id),
    cat: def.key,
    id: item.id,
    name: item.name,
    subtitle: def.subtitle(item) || '',
    description: item.description ?? null,
    chips: def.chips(item),
    badges: def.badges?.(item) ?? [],
    image: imageFor(def, item),
    rating,
    modes,
    facets,
    sortValues,
    // Category label and modes are searchable too, so "trevor missions" or "online heists" work.
    search: toSearchFields([...def.search(item), [def.label, 1], [modes.join(' '), 1]]),
  };
}

let allCards: CardModel[] | null = null;

export function getAllCards(): CardModel[] {
  allCards ??= CATEGORY_KEYS.flatMap((k) => CATEGORIES[k].items.map((it) => toCard(CATEGORIES[k], it)));
  return allCards;
}

export function getCards(cat: CategoryKey): CardModel[] {
  return getAllCards().filter((c) => c.cat === cat);
}

/** Finds an item by its id within a category. */
export function findItem(cat: CategoryKey, id: string): BaseItem | undefined {
  return CATEGORIES[cat].items.find((it) => it.id === id);
}

let byName: Map<string, CardModel> | null = null;

/** Finds any item whose name or alias matches (used to turn plain names into links). */
export function findByName(name: string): CardModel | undefined {
  if (!byName) {
    byName = new Map();
    for (const k of CATEGORY_KEYS) {
      for (const it of CATEGORIES[k].items) {
        for (const n of [it.name, ...(it.aliases ?? [])]) {
          const key = normalize(n);
          if (key && !byName.has(key)) byName.set(key, toCard(CATEGORIES[k], it));
        }
      }
    }
  }
  return byName.get(normalize(name));
}

export type CountsByMode = Record<'all' | 'Story' | 'Online', Partial<Record<CategoryKey, number>>>;

/** Number of items per category for each game-mode filter (small enough to send with every page). */
export function getCountsByMode(): CountsByMode {
  const counts: CountsByMode = { all: {}, Story: {}, Online: {} };
  for (const c of getAllCards()) {
    counts.all[c.cat] = (counts.all[c.cat] ?? 0) + 1;
    for (const m of c.modes) counts[m][c.cat] = (counts[m][c.cat] ?? 0) + 1;
  }
  return counts;
}
