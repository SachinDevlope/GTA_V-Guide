import data from '@/data/skills.json';
import type { CategoryDefinition } from '@/features/catalog/types';
import type { Skill } from './types';

export const skillsCategory: CategoryDefinition<Skill> = {
  key: 'skills',
  label: 'Skills & Stats',
  short: 'Skills',
  color: 'var(--c-skills)',
  layout: 'list',
  blurb: 'The eight character skills and the fastest ways to raise them.',
  items: data as unknown as Skill[],
  modes: () => ['Story'],
  subtitle: (s) => s.summary,
  chips: () => [],
  facts: () => [],
  lists: (s) => [{ title: 'How to improve', items: s.howToImprove }],
  filters: [],
  sortValues: (s) => ({ position: data.findIndex((x) => x.id === s.id) }),
  sorts: [
    { label: 'Default', key: 'position', dir: 'asc' },
    { label: 'Name A–Z', key: 'name', dir: 'asc' },
  ],
  search: (s) => [
    [s.tags, 5],
    [s.summary, 3],
    [s.howToImprove, 2],
  ],
};
