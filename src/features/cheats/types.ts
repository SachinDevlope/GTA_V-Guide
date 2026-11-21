import type { BaseItem } from '@/features/catalog/types';

export interface Cheat extends BaseItem {
  effect: string;
  pc: string | null;
  phone: string | null;
  playstation: string | null;
  xbox: string | null;
  notes: string | null;
}
