import type { ChipData, GameMode, ImageRef } from '@/shared/types';
import type { Rating } from '@/features/ratings/types';
import type { SearchField } from '@/features/search/lib/types';

export type CategoryKey =
  | 'missions'
  | 'heists'
  | 'online-missions'
  | 'businesses'
  | 'vehicles'
  | 'weapons'
  | 'characters'
  | 'cheats'
  | 'skills'
  | 'collectibles';

/** Fields every data record has. */
export interface BaseItem {
  id: string;
  name: string;
  description?: string | null;
  tags?: string[];
  aliases?: string[];
  /** Optional hand-picked image URL; otherwise src/data/images.json is used. */
  image?: string;
}

export interface Fact {
  label: string;
  value: string | number | null | undefined;
  /** Value names other items (e.g. a mission giver); render as links where they exist. */
  link?: boolean;
  /** Show as a big tile next to the picture (pick up to four per category). */
  key?: boolean;
}

export interface ListBlock {
  title: string;
  items: string[] | null | undefined;
  link?: boolean;
}

/** A 0–100 bar shown on the detail page (e.g. weapon damage). `upgraded` draws a second, lighter bar. */
export interface StatBar {
  label: string;
  value: number | null | undefined;
  upgraded?: number | null;
}

/** A recommended pick (attachment, upgrade…) and why. */
export interface Recommendation {
  name: string;
  why: string;
  /** GTA$ cost of this pick, when known. */
  price?: number | null;
}

export interface RecommendationBlock {
  title: string;
  /** Highlighted line above the picks, e.g. "Best for: long-range sniping". */
  highlight?: string;
  /** Small print under the picks, e.g. how they were chosen. */
  note?: string;
  items: Recommendation[];
  /** Totals strip, e.g. upgrades cost / base price / fully upgraded price. */
  summary?: { label: string; value: string; strong?: boolean }[];
}

export interface CodeLine {
  platform: string;
  code: string | null | undefined;
}

/** Small icon marker on a card and next to the title (e.g. electric vehicles). */
export interface BadgeData {
  /** Icon name understood by ItemBadges (e.g. "electric"). */
  icon: 'electric';
  label: string;
}

export interface FilterDef {
  /** Key into CardModel.facets. */
  key: string;
  label: string;
}

export interface SortDef {
  label: string;
  /** Key into CardModel.sortValues ("name" is always present). */
  key: string;
  dir: 'asc' | 'desc';
  /** Hide items that have no value for this sort (e.g. "HSW top speed" shows only HSW vehicles). */
  onlyWithValue?: boolean;
}

/**
 * Everything the app needs to know about one category of data.
 * Each feature module (missions, vehicles, …) exports one of these.
 */
export interface CategoryDefinition<T extends BaseItem = BaseItem> {
  key: CategoryKey;
  label: string;
  short: string;
  /** CSS color used to tint this category. */
  color: string;
  items: T[];
  modes(item: T): GameMode[];
  subtitle(item: T): string;
  chips(item: T): ChipData[];
  badges?(item: T): BadgeData[];
  facts(item: T): Fact[];
  lists?(item: T): ListBlock[];
  codes?(item: T): CodeLine[];
  stats?(item: T): StatBar[];
  /** Star rating, computed from the data (see features/ratings). */
  rating?(item: T): Rating | null;
  /** "Best upgrades" / "Best attachments" picks shown on the detail page. */
  recommendations?(item: T): RecommendationBlock | null;
  /** Values used by filter dropdowns, by filter key. */
  facets?(item: T): Record<string, string | string[] | number | null | undefined>;
  filters: FilterDef[];
  sortValues?(item: T): Record<string, number | string | null | undefined>;
  sorts: SortDef[];
  /** [value, weight] pairs to search, most important first (the name should come first). */
  search(item: T): [unknown, number][];
  /** "grid" = picture cards, "list" = compact rows. */
  layout: 'grid' | 'list';
  /** One line shown under the category title. */
  blurb: string;
}

/** Serializable summary of an item, safe to send to client components. */
export interface CardModel {
  key: string;
  href: string;
  cat: CategoryKey;
  id: string;
  name: string;
  subtitle: string;
  description: string | null;
  chips: ChipData[];
  badges: BadgeData[];
  image: ImageRef | null;
  rating: Rating | null;
  modes: GameMode[];
  facets: Record<string, string[]>;
  sortValues: Record<string, number | string | null>;
  search: SearchField[];
}

/** Serializable category info for client components. */
export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  short: string;
  color: string;
  filters: FilterDef[];
  sorts: SortDef[];
  layout: 'grid' | 'list';
  blurb: string;
}
