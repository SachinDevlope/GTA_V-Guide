import type { BaseItem } from '@/features/catalog/types';

export interface Heist extends BaseItem {
  dlc: string | null;
  year: number | null;
  players: string | null;
  contact: string | null;
  startLocation: string | null;
  requirement: string | null;
  setups: string[];
  finale: string | null;
  approaches: string[];
  potentialTake: string | null;
  eliteChallenge: string | null;
  bestApproach?: { name: string; why: string } | null;
  bestChoices?: { name: string; why: string }[];
  payout?: {
    min: number | null;
    max: number | null;
    eliteBonus: number | null;
    perHour: number | null;
    note: string | null;
  } | null;
  soloPossible?: boolean | null;
  tier?: 'S' | 'A' | 'B' | 'C' | null;
  pros?: string[];
  cons?: string[];
}

export interface Business extends BaseItem {
  type: string;
  dlc: string | null;
  buyFrom: string | null;
  priceMin: number | null;
  priceMax: number | null;
  requires: string | null;
  income: string | null;
  earnings?: {
    perHour: number | null;
    perHourNote: string | null;
    style: 'Passive' | 'Active' | 'Mixed' | 'None';
    soloFriendly: boolean | null;
    paybackHours: number | null;
  };
  tier?: 'S' | 'A' | 'B' | 'C' | null;
  pros?: string[];
  cons?: string[];
  verdict?: string | null;
  upgrades?: BusinessUpgrade[];
  incomeLevels?: IncomeLevel[];
  passiveIncome?: PassiveIncome | null;
}

/** A purchasable upgrade that changes how much a business earns. */
export interface BusinessUpgrade {
  name: string;
  price: number | null;
  effect: string;
}

/** Earnings at one upgrade state (e.g. "No upgrades", "Fully upgraded"). */
export interface IncomeLevel {
  level: string;
  unitValue: number | null;
  fullStockValue: number | null;
  fullStockValueFar: number | null;
  timeToFullHours: number | null;
  /** Cost of the supplies for one full stock, when bought. */
  supplyCost?: number | null;
  /** Sale value per hour of production (selling nearby), before supply costs. */
  perHour: number | null;
  note: string | null;
}

/** Money that builds up on its own (safes and similar). */
export interface PassiveIncome {
  source: string;
  maxPerDay: number | null;
  maxStored: number | null;
  requirement: string | null;
}
