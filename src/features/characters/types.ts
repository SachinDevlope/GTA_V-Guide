import type { BaseItem } from '@/features/catalog/types';

export interface Character extends BaseItem {
  role: string;
  aliases: string[];
  voiceActor: string | null;
  affiliation: string | null;
  specialAbility: string | null;
}
