import data from '@/data/missions.json';
import type { CategoryDefinition } from '@/features/catalog/types';
import { compact, joinList } from '@/shared/lib/format';
import type { Mission } from './types';

export const missionsCategory: CategoryDefinition<Mission> = {
  key: 'missions',
  label: 'Story Missions',
  short: 'Missions',
  color: 'var(--c-missions)',
  layout: 'list',
  blurb: 'Every story mission, heist and Strangers and Freaks job, in order.',
  items: data as unknown as Mission[],
  modes: () => ['Story'],
  subtitle: (m) => compact([m.type, joinList(m.protagonists)]).join(' · '),
  chips: (m) => compact([m.order != null && `#${m.order}`, m.giver]).map((label) => ({ label })),
  facts: (m) => [
    { label: 'Type', value: m.type, key: true },
    { label: 'Story order', value: m.order },
    { label: 'Play as', value: joinList(m.protagonists), key: true },
    { label: 'Mission giver', value: m.giver, link: true, key: true },
    { label: 'Location', value: m.location },
    { label: 'Reward', value: m.reward, key: true },
  ],
  lists: (m) => [
    { title: 'Gold medal objectives', items: m.goldObjectives },
    { title: 'Unlocks', items: m.unlocks, link: true },
  ],
  facets: (m) => ({ type: m.type, protagonists: m.protagonists }),
  filters: [
    { key: 'type', label: 'Type' },
    { key: 'protagonists', label: 'Character' },
  ],
  sortValues: (m) => ({ order: m.order }),
  sorts: [
    { label: 'Story order', key: 'order', dir: 'asc' },
    { label: 'Name A–Z', key: 'name', dir: 'asc' },
  ],
  search: (m) => [
    [m.tags, 5],
    [m.giver, 4],
    [m.protagonists, 3],
    [m.location, 3],
    [m.type, 2],
    [m.unlocks, 1],
    [m.goldObjectives, 1],
  ],
};
