import data from '@/data/cheats.json';
import type { CategoryDefinition } from '@/features/catalog/types';
import type { Cheat } from './types';

export const cheatsCategory: CategoryDefinition<Cheat> = {
  key: 'cheats',
  label: 'Cheats',
  short: 'Cheats',
  color: 'var(--c-cheats)',
  layout: 'list',
  blurb: 'Story-mode cheat codes for PC, phone, PlayStation and Xbox.',
  items: data as unknown as Cheat[],
  modes: () => ['Story'],
  subtitle: (c) => c.effect,
  chips: (c) => (c.pc ? [{ label: `PC: ${c.pc}` }] : []),
  facts: (c) => [
    { label: 'Effect', value: c.effect, key: true },
    { label: 'Notes', value: c.notes },
  ],
  codes: (c) => [
    { platform: 'PC', code: c.pc },
    { platform: 'Phone', code: c.phone },
    { platform: 'PlayStation', code: c.playstation },
    { platform: 'Xbox', code: c.xbox },
  ],
  filters: [],
  sorts: [{ label: 'Name A–Z', key: 'name', dir: 'asc' }],
  search: (c) => [
    [c.pc, 9],
    [c.tags, 5],
    [c.effect, 3],
    [c.phone, 2],
    [c.notes, 1],
  ],
};
