import data from '@/data/online-missions.json';
import type { CategoryDefinition } from '@/features/catalog/types';
import { compact } from '@/shared/lib/format';
import type { OnlineMission } from './missions.types';

const yesNo = (v: boolean | null) => (v == null ? null : v ? 'Yes' : 'No');

export const onlineMissionsCategory: CategoryDefinition<OnlineMission> = {
  key: 'online-missions',
  label: 'Online Missions',
  short: 'Online Missions',
  color: 'var(--c-heists)',
  layout: 'list',
  blurb: 'Every GTA Online job outside heists: contact missions, VIP work, contracts, payphone hits and more.',
  items: data as unknown as OnlineMission[],
  modes: () => ['Online'],
  subtitle: (m) => compact([m.type, m.contact]).join(' · '),
  chips: (m) => compact([m.payout, m.players && `${m.players} players`]).map((label) => ({ label })),
  facts: (m) => [
    { label: 'Type', value: m.type, key: true },
    { label: 'Contact', value: m.contact, link: true, key: true },
    { label: 'Payout', value: m.payout, key: true },
    { label: 'Players', value: m.players, key: true },
    { label: 'Unlock rank', value: m.rank },
    { label: 'Repeatable', value: yesNo(m.repeatable) },
    { label: 'Update', value: m.dlc },
    { label: 'Released', value: m.year },
  ],
  facets: (m) => ({
    type: m.type,
    contact: m.contact,
    dlc: m.dlc,
    repeatable: m.repeatable == null ? null : m.repeatable ? 'Repeatable' : 'One-time',
  }),
  filters: [
    { key: 'type', label: 'Type' },
    { key: 'contact', label: 'Contact' },
    { key: 'dlc', label: 'Update' },
    { key: 'repeatable', label: 'Replay' },
  ],
  sortValues: (m) => ({ year: m.year, rank: m.rank }),
  sorts: [
    { label: 'Name A–Z', key: 'name', dir: 'asc' },
    { label: 'Newest first', key: 'year', dir: 'desc' },
    { label: 'Oldest first', key: 'year', dir: 'asc' },
    { label: 'Unlock rank', key: 'rank', dir: 'asc' },
  ],
  search: (m) => [
    [m.tags, 5],
    [m.contact, 4],
    [m.type, 3],
    [m.dlc, 2],
    [m.payout, 1],
  ],
};
