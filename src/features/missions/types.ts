import type { BaseItem } from '@/features/catalog/types';

export type MissionType = 'Story' | 'Heist' | 'Heist Setup' | 'Strangers and Freaks';

export interface Mission extends BaseItem {
  type: MissionType;
  order: number | null;
  protagonists: string[];
  giver: string | null;
  location: string | null;
  goldObjectives: string[];
  reward: string | null;
  unlocks: string[];
}
