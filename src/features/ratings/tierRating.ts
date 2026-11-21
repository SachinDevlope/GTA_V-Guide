import type { Rating } from './types';

const TIER_STARS: Record<string, number> = { S: 5, A: 4, B: 3, C: 2 };

/** Anything rated by a community-consensus tier (businesses, heists). */
export interface Tiered {
  tier?: 'S' | 'A' | 'B' | 'C' | null;
  pros?: string[];
  cons?: string[];
}

/** Stars from an S/A/B/C tier, with the item's own researched pros and cons. */
export function tierRating(item: Tiered, what: string): Rating | null {
  const stars = item.tier ? TIER_STARS[item.tier] : undefined;
  if (!stars) return null;
  return { stars, basis: `Tier ${item.tier} ${what}`, pros: item.pros ?? [], cons: item.cons ?? [] };
}
