import data from '@/data/characters.json';
import type { CategoryDefinition } from '@/features/catalog/types';
import { compact, joinList } from '@/shared/lib/format';
import type { Character } from './types';

export const charactersCategory: CategoryDefinition<Character> = {
  key: 'characters',
  label: 'Characters',
  short: 'Characters',
  color: 'var(--c-characters)',
  layout: 'grid',
  blurb: 'Protagonists, friends, family and enemies — with their voice actors.',
  items: data as unknown as Character[],
  modes: () => ['Story', 'Online'],
  subtitle: (c) => compact([c.role, c.affiliation]).join(' · '),
  chips: (c) => (c.voiceActor ? [{ label: `Voice: ${c.voiceActor}` }] : []),
  facts: (c) => [
    { label: 'Role', value: c.role, key: true },
    { label: 'Also known as', value: joinList(c.aliases) },
    { label: 'Voice actor', value: c.voiceActor, key: true },
    { label: 'Affiliation', value: c.affiliation, key: true },
    { label: 'Special ability', value: c.specialAbility, key: true },
  ],
  facets: (c) => ({ role: c.role }),
  filters: [{ key: 'role', label: 'Role' }],
  sorts: [{ label: 'Name A–Z', key: 'name', dir: 'asc' }],
  search: (c) => [
    [c.aliases, 8],
    [c.tags, 5],
    [c.voiceActor, 3],
    [c.affiliation, 2],
    [c.role, 2],
  ],
};
