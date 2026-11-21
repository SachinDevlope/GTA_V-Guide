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
}
