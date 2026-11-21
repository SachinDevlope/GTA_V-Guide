import { charactersCategory } from '@/features/characters/category';
import { cheatsCategory } from '@/features/cheats/category';
import { collectiblesCategory } from '@/features/collectibles/category';
import { missionsCategory } from '@/features/missions/category';
import { businessesCategory } from '@/features/online/businesses.category';
import { heistsCategory } from '@/features/online/heists.category';
import { onlineMissionsCategory } from '@/features/online/missions.category';
import { skillsCategory } from '@/features/skills/category';
import { vehiclesCategory } from '@/features/vehicles/category';
import { weaponsCategory } from '@/features/weapons/category';
import type { BaseItem, CategoryDefinition, CategoryKey, CategoryMeta } from './types';

/**
 * Single source of truth for which categories exist and in what order they appear.
 * To add a category: create a feature folder with a CategoryDefinition and list it here.
 */
const DEFINITIONS = [
  missionsCategory,
  heistsCategory,
  onlineMissionsCategory,
  businessesCategory,
  vehiclesCategory,
  weaponsCategory,
  charactersCategory,
  cheatsCategory,
  skillsCategory,
  collectiblesCategory,
] as unknown as CategoryDefinition<BaseItem>[];

export const CATEGORIES: Record<CategoryKey, CategoryDefinition<BaseItem>> = Object.fromEntries(
  DEFINITIONS.map((d) => [d.key, d]),
) as Record<CategoryKey, CategoryDefinition<BaseItem>>;

export const CATEGORY_KEYS: CategoryKey[] = DEFINITIONS.map((d) => d.key);

export function isCategoryKey(k: string): k is CategoryKey {
  return k in CATEGORIES;
}

export function getCategory(k: CategoryKey): CategoryDefinition<BaseItem> {
  return CATEGORIES[k];
}

export function toMeta(d: CategoryDefinition<BaseItem>): CategoryMeta {
  return { key: d.key, label: d.label, short: d.short, color: d.color, filters: d.filters, sorts: d.sorts, layout: d.layout, blurb: d.blurb };
}

export const CATEGORY_META: CategoryMeta[] = DEFINITIONS.map(toMeta);
