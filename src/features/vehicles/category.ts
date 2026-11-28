import data from '@/data/vehicles.json';
import type { CategoryDefinition } from '@/features/catalog/types';
import { vehicleRatings } from '@/features/ratings/vehicleRatings';
import { availabilityLabel, exclusiveChip, modesFor } from '@/shared/lib/availability';
import { compact, money } from '@/shared/lib/format';
import { bestUpgrades } from './lib/bestUpgrades';
import { vehicleTypeKeywords, vehicleType } from './lib/vehicleTypes';
import type { Vehicle } from './types';

const items = data as unknown as Vehicle[];
const tradeText = (v: Vehicle) => {
  if (!v.trade) return null;
  const save = v.price != null ? v.price - v.trade.price : null;
  return `${money(v.trade.price)}${save && save > 0 ? ` (save ${money(save)})` : ''}`;
};
const speed = (v: Vehicle) => (v.topSpeedMph ? `${v.topSpeedMph} mph` : null);
const perf = (v: Vehicle, key: 'speed' | 'acceleration' | 'braking' | 'traction') => ({
  value: v.performance?.stock?.[key] ?? null,
  upgraded: v.performance?.upgraded?.[key] ?? null,
});

export const vehiclesCategory: CategoryDefinition<Vehicle> = {
  key: 'vehicles',
  label: 'Vehicles',
  short: 'Vehicles',
  color: 'var(--c-vehicles)',
  layout: 'grid',
  blurb: 'Cars, bikes, aircraft and boats with prices, top speeds, upgrades and ratings.',
  items,
  modes: (v) => modesFor(v.availability),
  rating: vehicleRatings(items),
  recommendations: bestUpgrades,
  subtitle: (v) => compact([v.manufacturer, v.class]).join(' · '),
  badges: (v) => (v.electric ? [{ icon: 'electric', label: 'Electric' }] : []),
  chips: (v) =>
    compact([
      money(v.price) && { label: money(v.price)!, tone: 'money' as const },
      v.trade && { label: `Trade ${money(v.trade.price)}`, tone: 'money' as const },
      speed(v) && { label: speed(v)! },
      exclusiveChip(v.availability) && { label: exclusiveChip(v.availability)! },
    ]),
  facts: (v) => [
    { label: 'Price', value: money(v.price), key: true },
    { label: 'Trade price', value: tradeText(v) },
    { label: 'Top speed', value: speed(v), key: true },
    { label: 'Lap time', value: v.lapTime, key: true },
    { label: 'Class', value: v.class, key: true },
    { label: 'Manufacturer', value: v.manufacturer },
    { label: 'Sold at', value: v.seller },
    { label: 'Seats', value: v.seats },
    { label: 'Drivetrain', value: v.drivetrain },
    { label: 'HSW top speed', value: v.hswTopSpeedMph ? `${v.hswTopSpeedMph} mph` : null },
    { label: 'Based on', value: v.basedOn },
    { label: 'Available in', value: availabilityLabel(v.availability) },
    { label: 'Added in', value: v.dlc },
  ],
  stats: (v) => [
    { label: 'Speed', ...perf(v, 'speed') },
    { label: 'Acceleration', ...perf(v, 'acceleration') },
    { label: 'Braking', ...perf(v, 'braking') },
    { label: 'Traction', ...perf(v, 'traction') },
  ],
  lists: (v) => [
    { title: 'Where to upgrade', items: v.upgradeShops },
    { title: 'What upgrades add', items: v.upgradeNotes ? [v.upgradeNotes] : [] },
  ],
  facets: (v) => ({
    class: v.class,
    manufacturer: v.manufacturer,
    seller: v.seller,
    availability: v.availability,
    upgradeShops: v.upgradeShops,
    trade: v.trade ? (v.trade.unlockType ?? 'Other') : null,
  }),
  filters: [
    { key: 'class', label: 'Class' },
    { key: 'manufacturer', label: 'Manufacturer' },
    { key: 'seller', label: 'Sold at' },
    { key: 'upgradeShops', label: 'Upgradable at' },
    { key: 'availability', label: 'Available in' },
    { key: 'trade', label: 'Trade price unlock' },
  ],
  sortValues: (v) => ({
    tradePrice: v.trade?.price,
    tradeSaving: v.trade && v.price ? v.price - v.trade.price : null,
    hswSpeed: v.hswTopSpeedMph, price: v.price, speed: v.topSpeedMph, lap: v.lapTimeSeconds, accel: v.performance?.upgraded?.acceleration ?? v.performance?.stock?.acceleration }),
  sorts: [
    { label: 'Name A–Z', key: 'name', dir: 'asc' },
    { label: 'Top rated', key: 'rating', dir: 'desc' },
    { label: 'Fastest lap time', key: 'lap', dir: 'asc' },
    { label: 'Top speed', key: 'speed', dir: 'desc' },
    { label: 'HSW top speed', key: 'hswSpeed', dir: 'desc', onlyWithValue: true },
    { label: 'Best acceleration', key: 'accel', dir: 'desc' },
    { label: 'Price: high to low', key: 'price', dir: 'desc' },
    { label: 'Price: low to high', key: 'price', dir: 'asc' },
    { label: 'Biggest trade discount', key: 'tradeSaving', dir: 'desc', onlyWithValue: true },
    { label: 'Trade price: low to high', key: 'tradePrice', dir: 'asc', onlyWithValue: true },
  ],
  search: (v) => [
    [v.tags, 5],
    [v.electric ? 'electric ev battery' : null, 3],
    [vehicleTypeKeywords(vehicleType(v.class)), 3],
    [v.manufacturer, 4],
    [v.basedOn, 3],
    [v.class, 3],
    [bestUpgrades(v) ? 'best upgrades mods tuning' : null, 1],
    [v.hswTopSpeedMph ? 'hsw haos special works' : null, 2],
    [v.upgradeShops, 1],
    [v.seller, 1],
    [v.dlc, 1],
  ],
};
