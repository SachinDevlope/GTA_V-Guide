import type { BaseItem } from '@/features/catalog/types';

export interface OnlineMission extends BaseItem {
  type: string;
  contact: string | null;
  players: string | null;
  rank: number | null;
  payout: string | null;
  dlc: string | null;
  year: number | null;
  repeatable: boolean | null;
}
