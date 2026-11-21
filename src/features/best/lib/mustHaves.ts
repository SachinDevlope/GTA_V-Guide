import raw from '@/data/online-must-haves.json';
import { getAllCards } from '@/features/catalog/lib/cards';
import type { CardModel } from '@/features/catalog/types';

interface RawPick {
  ref: string;
  why: string;
  role?: string;
}

interface RawData {
  updated: string;
  buyingOrder: RawPick[];
  groups: { title: string; items: RawPick[] }[];
}

/** A recommended item joined with its card (picture, price, rating, link). */
export interface MustHave {
  card: CardModel;
  why: string;
  role?: string;
}

const DATA = raw as unknown as RawData;

function resolve(picks: RawPick[]): MustHave[] {
  const byKey = new Map(getAllCards().map((c) => [c.key, c]));
  // Picks whose item no longer exists are skipped rather than breaking the page.
  return picks.flatMap((p) => {
    const card = byKey.get(p.ref);
    return card ? [{ card, why: p.why, role: p.role }] : [];
  });
}

/** "Best to have in GTA Online": a buying order plus must-haves by type. */
export function getMustHaves() {
  return {
    updated: DATA.updated,
    buyingOrder: resolve(DATA.buyingOrder ?? []),
    groups: (DATA.groups ?? []).map((g) => ({ title: g.title, items: resolve(g.items) })).filter((g) => g.items.length),
  };
}
