import { getCards } from '@/features/catalog/lib/cards';
import type { CardModel, CategoryKey } from '@/features/catalog/types';

export interface Board {
  title: string;
  /** Short line on how the ranking works. */
  note: string;
  cards: CardModel[];
}

const byRatingThen = (key: string, dir: 1 | -1) => (a: CardModel, b: CardModel) =>
  (b.rating?.stars ?? 0) - (a.rating?.stars ?? 0) ||
  ((Number(a.sortValues[key] ?? (dir === 1 ? Infinity : -Infinity)) - Number(b.sortValues[key] ?? (dir === 1 ? Infinity : -Infinity))) * dir);

/** Top N rated cards per facet value (e.g. per vehicle class). */
function perGroup(cat: CategoryKey, facet: string, groups: string[], n: number, tie: [string, 1 | -1], note: (g: string) => string): Board[] {
  const cards = getCards(cat).filter((c) => c.rating);
  return groups
    .map((g) => ({
      title: g,
      note: note(g),
      cards: cards.filter((c) => c.facets[facet]?.includes(g)).sort(byRatingThen(...tie)).slice(0, n),
    }))
    .filter((b) => b.cards.length > 0);
}

export function businessBoard(): Board {
  const cards = getCards('businesses')
    .filter((c) => c.rating)
    .sort(byRatingThen('perHour', -1));
  return {
    title: 'Best businesses to buy',
    note: 'Ranked by money-making tier, then by estimated earnings per hour from recent community guides.',
    cards,
  };
}

export function heistBoard(): Board {
  const cards = getCards('heists')
    .filter((c) => c.rating)
    .sort(byRatingThen('payout', -1));
  return {
    title: 'Best heists',
    note: 'Ranked by money-for-time tier, then by maximum payout, from recent community guides.',
    cards,
  };
}

export const VEHICLE_CLASSES_SHOWN = [
  'Super',
  'Sports',
  'Sports Classics',
  'Muscle',
  'Coupes',
  'Sedans',
  'SUVs',
  'Compacts',
  'Off-Road',
  'Motorcycles',
  'Open Wheel',
  'Helicopters',
  'Planes',
  'Boats',
];

export function vehicleBoards(): Board[] {
  return perGroup('vehicles', 'class', VEHICLE_CLASSES_SHOWN, 5, ['lap', 1], (g) => `Fastest ${g.toLowerCase()} by tested lap time (or top speed).`);
}

export const WEAPON_CATEGORIES_SHOWN = [
  'Assault Rifles',
  'Submachine Guns',
  'Shotguns',
  'Sniper Rifles',
  'Light Machine Guns',
  'Handguns',
  'Heavy Weapons',
  'Melee',
];

export function weaponBoards(): Board[] {
  return perGroup('weapons', 'category', WEAPON_CATEGORIES_SHOWN, 5, ['damage', -1], (g) => `Best ${g.toLowerCase()} by combined damage, fire rate, accuracy and range.`);
}
