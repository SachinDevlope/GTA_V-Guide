import storyData from '@/data/collectibles.json';
import onlineData from '@/data/online-collectibles.json';
import type { CategoryDefinition } from '@/features/catalog/types';
import { compact } from '@/shared/lib/format';
import { hasLocations } from './lib/locations';
import type { Collectible } from './types';

const items: Collectible[] = [
  ...(storyData as unknown as Omit<Collectible, 'mode'>[]).map((c) => ({ ...c, mode: 'Story' as const })),
  ...(onlineData as unknown as Omit<Collectible, 'mode'>[]).map((c) => ({ ...c, mode: 'Online' as const })),
];

export const collectiblesCategory: CategoryDefinition<Collectible> = {
  key: 'collectibles',
  label: 'Collectibles',
  short: 'Collectibles',
  color: 'var(--c-collectibles)',
  layout: 'grid',
  blurb: 'Hidden items across the map in Story mode and GTA Online.',
  items,
  modes: (c) => [c.mode],
  subtitle: (c) => compact([c.mode === 'Online' ? 'GTA Online' : 'Story mode', c.character !== 'Any' && c.character]).join(' · '),
  chips: (c) =>
    compact([c.count ? `${c.count} to find` : null, hasLocations(c.id) ? 'Map of every spot' : null, c.reward && c.reward.length < 34 ? c.reward : null]).map((label) => ({ label })),
  facts: (c) => [
    { label: 'Mode', value: c.mode, key: true },
    { label: 'How many', value: c.count, key: true },
    { label: 'Character', value: c.character, key: true },
    { label: 'Given by', value: c.giver, link: true },
    { label: 'Reward', value: c.reward, key: true },
  ],
  facets: (c) => ({ mode: c.mode, map: hasLocations(c.id) ? 'Has a map' : 'No map yet' }),
  filters: [
    { key: 'mode', label: 'Mode' },
    { key: 'map', label: 'Map' },
  ],
  sortValues: (c) => ({ count: c.count, position: items.indexOf(c) }),
  sorts: [
    { label: 'Default', key: 'position', dir: 'asc' },
    { label: 'Name A–Z', key: 'name', dir: 'asc' },
    { label: 'Most to find', key: 'count', dir: 'desc' },
  ],
  search: (c) => [
    [c.tags, 5],
    [c.giver, 3],
    [c.character, 2],
    [c.reward, 2],
    [c.mode, 1],
  ],
};
