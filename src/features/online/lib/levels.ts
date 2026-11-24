import type { IncomeLevel } from '../types';

/** Profit per hour after buying the supplies for a full stock, when the supply cost is known. */
export function profitPerHour(l: IncomeLevel): number | null {
  if (l.perHour == null || l.supplyCost == null || !l.timeToFullHours) return null;
  return Math.round(l.perHour - l.supplyCost / l.timeToFullHours);
}

/** The "no upgrades" level, if the business has one. */
export function baseLevel(levels: IncomeLevel[]): IncomeLevel | null {
  return levels.find((l) => /^no upgrades/i.test(l.level)) ?? null;
}

/** The fully upgraded level, or else the level that earns most per hour. */
export function bestLevel(levels: IncomeLevel[]): IncomeLevel | null {
  const full = levels.find((l) => /^fully upgraded/i.test(l.level));
  if (full) return full;
  const rated = levels.filter((l) => l.perHour != null);
  return rated.length ? rated.reduce((a, b) => ((b.perHour ?? 0) > (a.perHour ?? 0) ? b : a)) : null;
}
