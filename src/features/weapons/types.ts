import type { BaseItem } from '@/features/catalog/types';
import type { Availability } from '@/shared/lib/availability';

/** In-game stat bars, 0–100 (null when the game shows none). */
export interface WeaponStats {
  damage: number | null;
  fireRate: number | null;
  accuracy: number | null;
  range: number | null;
}

export interface Weapon extends BaseItem {
  category: string;
  price: number | null;
  basedOn: string | null;
  availability: Availability;
  dlc: string | null;
  mk2: boolean;
  stats?: WeaponStats;
  attachments?: string[];
  tints?: number | null;
  mk2Upgrades?: string[];
  upgradesTo?: string | null;
  upgradedFrom?: string | null;
  upgradedStats?: WeaponStats | null;
  bestAttachments?: { name: string; why: string }[];
  bestFor?: string | null;
  attachmentPrices?: Record<string, number> | null;
  bestLoadoutCost?: number | null;
}
