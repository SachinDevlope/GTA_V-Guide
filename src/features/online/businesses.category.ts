import data from '@/data/businesses.json';
import type { CategoryDefinition } from '@/features/catalog/types';
import { businessRating } from '@/features/ratings/businessRatings';
import { compact, money, priceRange } from '@/shared/lib/format';
import type { Business } from './types';

const perHour = (b: Business) => (b.earnings?.perHour ? `${money(b.earnings.perHour)}/hr` : null);
const yesNo = (v: boolean | null | undefined) => (v == null ? null : v ? 'Yes' : 'No');

export const businessesCategory: CategoryDefinition<Business> = {
  key: 'businesses',
  label: 'Online Businesses & Properties',
  short: 'Businesses',
  color: 'var(--c-businesses)',
  layout: 'grid',
  blurb: 'What to buy in GTA Online: prices, earnings per hour, tiers and why.',
  items: data as unknown as Business[],
  modes: () => ['Online'],
  rating: businessRating,
  subtitle: (b) => compact([b.type, b.dlc]).join(' · '),
  chips: (b) =>
    compact([
      priceRange(b.priceMin, b.priceMax) && { label: priceRange(b.priceMin, b.priceMax)!, tone: 'money' as const },
      perHour(b) && { label: `Earns ~${perHour(b)}` },
      b.tier && { label: `Tier ${b.tier}` },
    ]),
  facts: (b) => [
    { label: 'Price', value: priceRange(b.priceMin, b.priceMax), key: true },
    { label: 'Earnings', value: perHour(b), key: true },
    { label: 'Income style', value: b.earnings?.style !== 'None' ? b.earnings?.style : null, key: true },
    { label: 'Solo friendly', value: yesNo(b.earnings?.soloFriendly), key: true },
    { label: 'Pays for itself in', value: b.earnings?.paybackHours ? `~${b.earnings.paybackHours} hours of play` : null },
    { label: 'Tier', value: b.tier },
    { label: 'Type', value: b.type },
    { label: 'Buy from', value: b.buyFrom },
    { label: 'Requires', value: b.requires },
    { label: 'How it earns', value: b.income },
    { label: 'Earnings note', value: b.earnings?.perHourNote },
    { label: 'Update', value: b.dlc },
  ],
  lists: (b) => [{ title: 'Verdict', items: b.verdict ? [b.verdict] : [] }],
  facets: (b) => ({
    type: b.type,
    dlc: b.dlc,
    style: b.earnings?.style,
    solo: b.earnings?.soloFriendly == null ? null : b.earnings.soloFriendly ? 'Solo friendly' : 'Needs a crew',
    tier: b.tier,
  }),
  filters: [
    { key: 'tier', label: 'Tier' },
    { key: 'style', label: 'Income' },
    { key: 'solo', label: 'Solo' },
    { key: 'type', label: 'Type' },
    { key: 'dlc', label: 'Update' },
  ],
  sortValues: (b) => ({ priceMin: b.priceMin, priceMax: b.priceMax ?? b.priceMin, perHour: b.earnings?.perHour, payback: b.earnings?.paybackHours }),
  sorts: [
    { label: 'Top rated', key: 'rating', dir: 'desc' },
    { label: 'Most money per hour', key: 'perHour', dir: 'desc' },
    { label: 'Pays back fastest', key: 'payback', dir: 'asc' },
    { label: 'Price: low to high', key: 'priceMin', dir: 'asc' },
    { label: 'Price: high to low', key: 'priceMax', dir: 'desc' },
    { label: 'Name A–Z', key: 'name', dir: 'asc' },
  ],
  search: (b) => [
    [b.tags, 5],
    [b.type, 3],
    [b.dlc, 3],
    [b.buyFrom, 2],
    [b.requires, 1],
    [b.income, 1],
  ],
};
