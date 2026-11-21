import type { GameMode } from '@/shared/types';

/** How data files say where something can be used. */
export type Availability = 'Story' | 'Online' | 'Both';

export function modesFor(a: Availability | null | undefined): GameMode[] {
  if (a === 'Story') return ['Story'];
  if (a === 'Online') return ['Online'];
  return ['Story', 'Online'];
}

export function availabilityLabel(a: Availability | null | undefined): string | null {
  if (!a) return null;
  return a === 'Both' ? 'Story & Online' : a;
}

/** Short chip text for items limited to one mode. */
export function exclusiveChip(a: Availability | null | undefined): string | null {
  return a === 'Online' ? 'Online only' : a === 'Story' ? 'Story only' : null;
}
