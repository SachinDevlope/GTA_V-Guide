import type { BaseItem } from '@/features/catalog/types';

export interface Skill extends BaseItem {
  summary: string;
  howToImprove: string[];
}
