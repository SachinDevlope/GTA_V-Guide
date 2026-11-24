import { CATEGORIES } from '@/features/catalog/registry';
import { itemHref } from '@/features/catalog/lib/cards';
import { imageFor } from '@/features/catalog/lib/images';
import type { ImageRef } from '@/shared/types';
import { businessesCategory } from '../businesses.category';
import type { Business } from '../types';
import { baseLevel, bestLevel, profitPerHour } from './levels';

/** One row of the income comparison table (serializable). */
export interface IncomeRow {
  id: string;
  name: string;
  href: string;
  image: ImageRef | null;
  type: string;
  basePerHour: number | null;
  fullPerHour: number | null;
  baseStock: number | null;
  fullStock: number | null;
  fullProfitPerHour: number | null;
  upgradesCost: number | null;
  levels: number;
  passive: string | null;
}

const first = (b: Business) => baseLevel(b.incomeLevels ?? []);
const last = (b: Business) => bestLevel(b.incomeLevels ?? []);

/** Businesses that have per-upgrade income data, summarised for comparison. */
export function getIncomeRows(): IncomeRow[] {
  const def = CATEGORIES.businesses;
  return businessesCategory.items
    .filter((b) => (b.incomeLevels?.length ?? 0) > 0 || b.passiveIncome)
    .map((b) => {
      const prices = (b.upgrades ?? []).map((u) => u.price).filter((p): p is number => typeof p === 'number');
      return {
        id: b.id,
        name: b.name,
        href: itemHref('businesses', b.id),
        image: imageFor(def, b),
        type: b.type,
        basePerHour: first(b)?.perHour ?? null,
        fullPerHour: last(b)?.perHour ?? null,
        baseStock: first(b)?.fullStockValue ?? null,
        fullStock: last(b)?.fullStockValue ?? null,
        fullProfitPerHour: (() => { const l = last(b); return l ? profitPerHour(l) : null; })(),
        upgradesCost: prices.length ? prices.reduce((a, c) => a + c, 0) : null,
        levels: b.incomeLevels?.length ?? 0,
        passive: b.passiveIncome?.source ?? null,
      };
    });
}
