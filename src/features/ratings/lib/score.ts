import type { Rating } from '../types';

/** Rounds a 0–1 score to 1–5 stars in half steps. */
export function toStars(score01: number): number {
  const s = 1 + 4 * Math.max(0, Math.min(1, score01));
  return Math.round(s * 2) / 2;
}

export interface Placement {
  /** 0 = worst in group, 1 = best. */
  p: number;
  /** 1 = best. */
  position: number;
  total: number;
}

/**
 * Where each item stands within its group for one measure.
 * `higherIsBetter` false is for things like lap times.
 */
export function placements<T>(
  items: T[],
  groupOf: (it: T) => string,
  valueOf: (it: T) => number | null | undefined,
  higherIsBetter = true,
): Map<T, Placement> {
  const groups = new Map<string, { it: T; v: number }[]>();
  for (const it of items) {
    const v = valueOf(it);
    if (v == null || Number.isNaN(v)) continue;
    const g = groupOf(it);
    groups.set(g, [...(groups.get(g) ?? []), { it, v }]);
  }
  const out = new Map<T, Placement>();
  const better = (a: number, b: number) => (higherIsBetter ? a > b : a < b);
  for (const list of groups.values()) {
    const n = list.length;
    for (const { it, v } of list) {
      // Ties share a rank and a score: "#3" for everyone tied in third place,
      // and a percentile taken from the middle of the tied block.
      const above = list.filter((o) => better(o.v, v)).length;
      const tied = list.filter((o) => o.v === v).length;
      const below = n - above - tied;
      const p = n === 1 ? 1 : (below + (tied - 1) / 2) / (n - 1);
      out.set(it, { p, position: above + 1, total: n });
    }
  }
  return out;
}

/** Adds a pro when an item is near the top of its group, a con when near the bottom. */
export function judge(
  pl: Placement | undefined,
  pros: string[],
  cons: string[],
  good: string,
  bad: string,
  { top = 0.8, bottom = 0.25 } = {},
) {
  if (!pl || pl.total < 3) return;
  if (pl.p >= top) pros.push(good);
  else if (pl.p <= bottom) cons.push(bad);
}

/** A measure to compare, with how to describe it when it's merely above or below average. */
export interface Measure {
  pl: Placement | undefined;
  /** e.g. "acceleration" */
  name: string;
}

/**
 * Makes sure an item gets at least one pro and one con: when nothing is extreme,
 * its best measure becomes a pro and its worst a con (worded as above/below average,
 * or as its strongest/weakest point with its rank).
 */
export function ensureBoth(measures: Measure[], pros: string[], cons: string[], group: string) {
  const known = measures.filter((m): m is { pl: Placement; name: string } => !!m.pl && m.pl.total >= 3);
  if (!known.length) return;
  const sorted = known.slice().sort((a, b) => b.pl.p - a.pl.p);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const at = (m: { pl: Placement }) => `#${m.pl.position} of ${m.pl.total} ${group}`;
  if (!pros.length) {
    pros.push(best.pl.p >= 0.5 ? `Above-average ${best.name} for ${group}` : `Strongest point: ${best.name} (${at(best)})`);
  }
  if (!cons.length && known.length > 1) {
    cons.push(worst.pl.p < 0.5 ? `Below-average ${worst.name} for ${group}` : `Weakest point: ${worst.name} (${at(worst)})`);
  }
}

/** Builds a rating lookup once per data set. */
export function memoRatings<T extends { id: string }>(build: () => Map<string, Rating>) {
  let cache: Map<string, Rating> | null = null;
  return (item: T): Rating | null => {
    cache ??= build();
    return cache.get(item.id) ?? null;
  };
}
