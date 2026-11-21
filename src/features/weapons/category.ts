import data from '@/data/weapons.json';
import type { CategoryDefinition } from '@/features/catalog/types';
import { weaponRatings } from '@/features/ratings/weaponRatings';
import { availabilityLabel, exclusiveChip, modesFor } from '@/shared/lib/availability';
import { compact, money } from '@/shared/lib/format';
import type { Weapon } from './types';

const items = data as unknown as Weapon[];
const nameOf = (id: string | null | undefined) => (id ? items.find((w) => w.id === id)?.name ?? null : null);

export const weaponsCategory: CategoryDefinition<Weapon> = {
  key: 'weapons',
  label: 'Weapons',
  short: 'Weapons',
  color: 'var(--c-weapons)',
  layout: 'grid',
  blurb: 'Every gun, melee weapon and throwable — stats, attachments, Mk II upgrades and ratings.',
  items,
  modes: (w) => modesFor(w.availability),
  rating: weaponRatings(items),
  recommendations: (w) =>
    w.bestAttachments?.length
      ? {
          title: 'Best attachments',
          highlight: w.bestFor ? `Best for: ${w.bestFor}` : undefined,
          note: 'Recommended loadout from community guides. Prices are GTA Online prices.',
          items: w.bestAttachments.map((b) => ({ ...b, price: w.attachmentPrices?.[b.name] ?? null })),
          summary: w.bestLoadoutCost
            ? [
                // Attachment prices are GTA Online prices; the gun price we have is the Story-mode price,
                // so they are shown side by side rather than added together.
                { label: 'Attachments total (GTA Online)', value: money(w.bestLoadoutCost)!, strong: true },
                ...(typeof w.price === 'number' ? [{ label: 'Gun price (Story mode)', value: money(w.price)! }] : []),
              ]
            : undefined,
        }
      : null,
  subtitle: (w) => compact([w.category, w.mk2 && 'Mk II']).join(' · '),
  chips: (w) =>
    compact([
      money(w.price) && { label: money(w.price)!, tone: 'money' as const },
      w.stats?.damage != null && { label: `Damage ${w.stats.damage}` },
      exclusiveChip(w.availability) && { label: exclusiveChip(w.availability)! },
    ]),
  facts: (w) => [
    { label: 'Category', value: w.category, key: true },
    { label: 'Story price', value: money(w.price), key: true },
    { label: 'Mk II upgrade', value: nameOf(w.upgradesTo), link: true, key: true },
    { label: 'Upgraded from', value: nameOf(w.upgradedFrom), link: true, key: true },
    { label: 'Available in', value: availabilityLabel(w.availability), key: true },
    { label: 'Based on', value: w.basedOn },
    { label: 'Tints', value: w.tints },
    { label: 'Added in', value: w.dlc },
  ],
  stats: (w) => [
    { label: 'Damage', value: w.stats?.damage, upgraded: w.upgradedStats?.damage },
    { label: 'Fire rate', value: w.stats?.fireRate, upgraded: w.upgradedStats?.fireRate },
    { label: 'Accuracy', value: w.stats?.accuracy, upgraded: w.upgradedStats?.accuracy },
    { label: 'Range', value: w.stats?.range, upgraded: w.upgradedStats?.range },
  ],
  lists: (w) => [
    { title: 'Attachments', items: w.attachments },
    { title: 'Mk II upgrades', items: w.mk2Upgrades },
  ],
  facets: (w) => ({
    category: w.category,
    availability: w.availability,
    upgrade: w.mk2 ? 'Mk II weapon' : w.upgradesTo ? 'Has a Mk II upgrade' : 'No Mk II',
  }),
  filters: [
    { key: 'category', label: 'Category' },
    { key: 'upgrade', label: 'Mk II' },
    { key: 'availability', label: 'Available in' },
  ],
  sortValues: (w) => ({
    price: w.price,
    damage: w.stats?.damage,
    fireRate: w.stats?.fireRate,
    accuracy: w.stats?.accuracy,
    range: w.stats?.range,
  }),
  sorts: [
    { label: 'Name A–Z', key: 'name', dir: 'asc' },
    { label: 'Top rated', key: 'rating', dir: 'desc' },
    { label: 'Most damage', key: 'damage', dir: 'desc' },
    { label: 'Fastest fire rate', key: 'fireRate', dir: 'desc' },
    { label: 'Most accurate', key: 'accuracy', dir: 'desc' },
    { label: 'Longest range', key: 'range', dir: 'desc' },
    { label: 'Price: low to high', key: 'price', dir: 'asc' },
    { label: 'Price: high to low', key: 'price', dir: 'desc' },
  ],
  search: (w) => [
    [w.tags, 5],
    [w.basedOn, 3],
    [w.category, 3],
    [w.bestAttachments?.length ? 'best attachments loadout' : null, 1],
    [w.bestAttachments?.map((b) => b.name), 2],
    [w.bestFor, 2],
    [w.attachments, 1],
    [w.dlc, 1],
  ],
};
