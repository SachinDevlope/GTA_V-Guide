import type { BaseItem } from '@/features/catalog/types';
import type { Availability } from '@/shared/lib/availability';

export interface Vehicle extends BaseItem {
  manufacturer: string | null;
  class: string;
  price: number | null;
  seller: string | null;
  seats: number | null;
  topSpeedMph: number | null;
  drivetrain: string | null;
  basedOn: string | null;
  availability: Availability;
  dlc: string | null;
  performance?: { stock: PerformanceBars; upgraded: PerformanceBars | null };
  lapTime?: string | null;
  lapTimeSeconds?: number | null;
  upgradeShops?: string[];
  upgradeNotes?: string | null;
  hswTopSpeedMph?: number | null;
  upgradeCosts?: UpgradeCosts | null;
  /** Battery-electric (gtabase "Electric Vehicle" feature). */
  electric?: boolean;
  /** Discounted price unlocked by doing something in game. */
  trade?: TradePrice | null;
}

export interface TradePrice {
  price: number;
  unlock: string;
  unlockType: string | null;
  note: string | null;
}

/** Los Santos Customs cost of each recommended upgrade (GTA$). */
export interface UpgradeCosts {
  engine: number | null;
  transmission: number | null;
  turbo: number | null;
  brakes: number | null;
  suspension: number | null;
  armor: number | null;
  tyres: number | null;
  /** Hao's Special Works conversion (HSW vehicles only). */
  hsw?: number | null;
  total: number | null;
  source: 'gtabase' | 'formula' | null;
  note: string | null;
}

export interface PerformanceBars {
  speed: number | null;
  acceleration: number | null;
  braking: number | null;
  traction: number | null;
}
