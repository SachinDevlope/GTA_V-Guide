import type { BaseItem } from '@/features/catalog/types';
import type { GameMode } from '@/shared/types';

export interface Collectible extends BaseItem {
  mode: GameMode;
  count: number | null;
  character?: string | null;
  giver?: string | null;
  reward: string | null;
}
