import type { RecommendationBlock, Recommendation } from '@/features/catalog/types';
import { money } from '@/shared/lib/format';
import type { Vehicle } from '../types';

const AIR = new Set(['Planes', 'Helicopters']);
const WATER = new Set(['Boats']);

/**
 * Recommended upgrades for a vehicle, built from the standard GTA V upgrade rules
 * and what this vehicle supports (shops, HSW, Imani Tech, weapons).
 */
export function bestUpgrades(v: Vehicle): RecommendationBlock | null {
  const shops = v.upgradeShops ?? [];
  if (!shops.length || v.class === 'Cycles') return null;
  // Towed trailers have no engine: only the turret weapon and armor can be changed.
  if (v.tags?.includes('trailer')) {
    return {
      title: 'Best upgrades',
      items: [
        { name: 'Dual 20mm Flak turret', why: 'Best against aircraft and Oppressors; the flak bursts near targets, so you do not need direct hits.' },
        { name: 'Armor plating', why: 'Lets the trailer and its gunner survive longer under fire.' },
      ],
      note: 'Changed in a Mobile Operations Center or Avenger vehicle workshop. A second player mans the turret while you tow it.',
    };
  }
  const paintOnly = /paint|livery/i.test(v.upgradeNotes ?? '') && /only|no performance/i.test(v.upgradeNotes ?? '');
  const items: Recommendation[] = [];

  if (shops.includes("Hao's Special Works")) {
    items.push({
      name: "Hao's Special Works upgrade",
      why: v.hswTopSpeedMph ? `Biggest single boost — top speed rises to ${v.hswTopSpeedMph} mph (PS5, Xbox Series X|S, PC Enhanced).` : 'Big boost to top speed and acceleration.',
      price: v.upgradeCosts?.hsw,
    });
  }

  if (AIR.has(v.class)) {
    if (!paintOnly) {
      items.push({ name: 'Countermeasures (flares or chaff)', why: 'Breaks missile lock-ons — the most useful aircraft upgrade.' });
      items.push({ name: 'Armour upgrade', why: 'Survives more hits from guns and explosives.' });
    }
    if (shops.includes('Weaponized')) items.push({ name: 'Weapon upgrades', why: 'Pick homing or explosive weapons where offered for air-to-ground work.' });
  } else if (!WATER.has(v.class) && shops.includes('Los Santos Customs')) {
    const bike = v.class === 'Motorcycles';
    const c = v.upgradeCosts;
    items.push({ name: 'Engine — EMS Upgrade, Level 4', why: 'Largest gain in acceleration.', price: c?.engine });
    items.push({ name: 'Transmission — Race', why: 'Faster gear changes, quicker acceleration.', price: c?.transmission });
    items.push({ name: 'Turbo Tuning', why: 'Extra punch when accelerating out of corners.', price: c?.turbo });
    items.push({ name: 'Brakes — Race', why: 'Stops shorter so you can brake later into corners.', price: c?.brakes });
    if (!bike) {
      items.push(
        v.class === 'Off-Road'
          ? { name: 'Suspension — Street or stock', why: 'Keeps ground clearance for jumps and rough terrain.' }
          : { name: 'Suspension — Competition', why: 'Lower body grips better on roads (may scrape on bumps).', price: c?.suspension },
      );
      items.push({ name: 'Armour — 100%', why: "Takes far more damage and doesn't slow the car down.", price: c?.armor });
    }
    items.push({ name: 'Bulletproof Tyres', why: "Gunfire and spike strips can't pop your tyres.", price: c?.tyres });
  } else if (!WATER.has(v.class) && shops.includes('Vehicle Workshop')) {
    // Specialist vehicles (Oppressor Mk II, Deluxo, armoured trucks…) are tuned in a mobile or property workshop.
    items.push({ name: 'Performance upgrades at the vehicle workshop', why: 'Max out engine, transmission and turbo where offered.' });
    items.push({ name: 'Countermeasures (if offered)', why: 'Flares or chaff break missile lock-ons.' });
  }

  if (shops.includes('Imani Tech')) items.push({ name: 'Imani Tech — Missile Lock-On Jammer', why: 'Stops homing missiles from locking on to you.' });
  if (shops.includes('Weaponized') && !AIR.has(v.class)) items.push({ name: 'Weapon and armour plating upgrades', why: 'Unlock the strongest weapons and plating at the vehicle workshop.' });
  if (shops.includes("Benny's Original Motor Works")) items.push({ name: "Benny's custom upgrade", why: 'Unlocks the custom version with many more options.' });

  if (!items.length) return null;
  // Total of the priced picks shown, plus the car itself.
  const upgradesTotal = items.reduce((sum, r) => sum + (typeof r.price === 'number' ? r.price : 0), 0);
  const summary = upgradesTotal
    ? [
        { label: 'Upgrades total', value: money(upgradesTotal)! },
        ...(typeof v.price === 'number' ? [{ label: 'Vehicle price', value: money(v.price)! }] : []),
        ...(typeof v.price === 'number' ? [{ label: 'Fully upgraded price', value: money(v.price + upgradesTotal)!, strong: true }] : []),
      ]
    : undefined;
  return {
    title: 'Best upgrades',
    summary,
    note: `Standard best-performance picks for this type of vehicle, plus the special upgrades it supports.${v.upgradeCosts?.note ? ` Prices: ${v.upgradeCosts.note}` : ''}`,
    items,
  };
}
