import data from '@/data/heists.json';
import type { CategoryDefinition, Recommendation } from '@/features/catalog/types';
import { tierRating } from '@/features/ratings/tierRating';
import { compact, money, priceRange } from '@/shared/lib/format';
import type { Heist } from './types';

const takeRange = (h: Heist) => priceRange(h.payout?.min, h.payout?.max);
const yesNo = (v: boolean | null | undefined) => (v == null ? null : v ? 'Yes' : 'No');

export const heistsCategory: CategoryDefinition<Heist> = {
  key: 'heists',
  label: 'Online Heists',
  short: 'Heists',
  color: 'var(--c-heists)',
  layout: 'grid',
  blurb: 'Every GTA Online heist and robbery: best approach, payouts, setups and ratings.',
  items: data as unknown as Heist[],
  modes: () => ['Online'],
  rating: (h) => tierRating(h, 'heist for money and time'),
  subtitle: (h) => compact([h.dlc, h.players && `${h.players} players`]).join(' · '),
  chips: (h) =>
    compact([
      takeRange(h) && { label: takeRange(h)!, tone: 'money' as const },
      h.year ? { label: String(h.year) } : null,
      h.soloPossible ? { label: 'Solo' } : null,
    ]),
  facts: (h) => [
    { label: 'Payout', value: takeRange(h), key: true },
    { label: 'Best approach', value: h.bestApproach?.name, key: true },
    { label: 'Solo', value: yesNo(h.soloPossible), key: true },
    { label: 'Players', value: h.players, key: true },
    { label: 'Contact', value: h.contact, link: true },
    { label: 'Update', value: h.dlc },
    { label: 'Released', value: h.year },
    { label: 'Starts at', value: h.startLocation },
    { label: 'Requirement', value: h.requirement },
    { label: 'Finale', value: h.finale },
    { label: 'Potential take', value: h.potentialTake },
    { label: 'Elite Challenge', value: h.elite ? null : h.eliteChallenge },
    { label: 'Payout note', value: h.payout?.note },
  ],
  recommendations: (h) => {
    const items: Recommendation[] = compact([
      h.bestApproach && { name: `Approach: ${h.bestApproach.name}`, why: h.bestApproach.why },
      ...(h.bestChoices ?? []),
    ]);
    const p = h.payout;
    const summary = compact([
      p?.min != null && { label: 'Minimum take', value: money(p.min)! },
      p?.max != null && { label: 'Maximum take', value: money(p.max)!, strong: true },
      p?.eliteBonus != null && { label: 'Elite bonus', value: money(p.eliteBonus)! },
      p?.perHour != null && { label: 'Per hour (approx.)', value: `${money(p.perHour)}/hr` },
    ]);
    if (!items.length && !summary.length) return null;
    return {
      title: 'Best approach & payout',
      highlight: h.soloPossible ? 'Can be done solo' : undefined,
      items,
      summary: summary.length ? summary : undefined,
      note: p?.note ?? 'Payouts from recent community guides; they change with game updates.',
    };
  },
  lists: (h) => [
    { title: 'All approaches', items: h.approaches },
    { title: 'Setup / prep missions', items: h.setups },
  ],
  facets: (h) => ({
    dlc: h.dlc,
    players: h.players,
    tier: h.tier,
    solo: h.soloPossible == null ? null : h.soloPossible ? 'Solo possible' : 'Needs a crew',
  }),
  filters: [
    { key: 'tier', label: 'Tier' },
    { key: 'solo', label: 'Solo' },
    { key: 'dlc', label: 'Update' },
    { key: 'players', label: 'Players' },
  ],
  sortValues: (h) => ({ year: h.year, payout: h.payout?.max, perHour: h.payout?.perHour }),
  sorts: [
    { label: 'Top rated', key: 'rating', dir: 'desc' },
    { label: 'Biggest payout', key: 'payout', dir: 'desc' },
    { label: 'Most money per hour', key: 'perHour', dir: 'desc' },
    { label: 'Release year', key: 'year', dir: 'asc' },
    { label: 'Newest first', key: 'year', dir: 'desc' },
    { label: 'Name A–Z', key: 'name', dir: 'asc' },
  ],
  search: (h) => [
    [h.tags, 5],
    [h.dlc, 4],
    [h.contact, 3],
    [h.approaches, 2],
    [h.bestApproach?.name, 2],
    [h.setups, 2],
    [h.payout ? 'payout best approach' : null, 1],
    [h.requirement, 1],
  ],
};
