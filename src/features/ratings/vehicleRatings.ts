import type { Vehicle } from '@/features/vehicles/types';
import { ensureBoth, judge, memoRatings, placements, toStars } from './lib/score';
import type { Rating } from './types';

const plural = (cls: string) => `${cls} vehicles`;

/** Mean of the stock stat bars that exist (speed, acceleration, braking, traction). */
function statBarAverage(v: Vehicle): number | null {
  const s = v.performance?.stock;
  if (!s) return null;
  const vals = [s.speed, s.acceleration, s.braking, s.traction].filter((x): x is number => typeof x === 'number');
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

/**
 * Vehicles are rated against their own class: by tested lap time when known
 * (lower is better), otherwise by fully upgraded top speed, otherwise by the
 * average of the in-game stat bars. Pros and cons compare each measure with
 * the rest of the class.
 */
export function vehicleRatings(vehicles: Vehicle[]) {
  return memoRatings<Vehicle>(() => {
    const cls = (v: Vehicle) => v.class;
    const lap = placements(vehicles, cls, (v) => v.lapTimeSeconds, false);
    const speed = placements(vehicles, cls, (v) => v.topSpeedMph);
    const accel = placements(vehicles, cls, (v) => v.performance?.stock?.acceleration);
    const braking = placements(vehicles, cls, (v) => v.performance?.stock?.braking);
    const traction = placements(vehicles, cls, (v) => v.performance?.stock?.traction);
    const price = placements(vehicles, cls, (v) => v.price, false); // cheaper = "better"
    const bars = placements(vehicles, cls, statBarAverage);

    const out = new Map<string, Rating>();
    for (const v of vehicles) {
      const main = lap.get(v) ?? speed.get(v) ?? bars.get(v);
      if (!main) continue;
      const by = lap.has(v) ? 'lap time' : speed.has(v) ? 'top speed' : 'in-game stats';
      const pros: string[] = [];
      const cons: string[] = [];
      const group = plural(v.class);

      judge(lap.get(v), pros, cons, `Fast lap time for ${group}${v.lapTime ? ` (${v.lapTime})` : ''}`, `Slow lap time for ${group}${v.lapTime ? ` (${v.lapTime})` : ''}`);
      judge(speed.get(v), pros, cons, `High top speed for ${group} (${v.topSpeedMph} mph)`, `Low top speed for ${group} (${v.topSpeedMph} mph)`);
      judge(accel.get(v), pros, cons, 'Quick acceleration', 'Slow acceleration');
      judge(braking.get(v), pros, cons, 'Strong brakes', 'Weak brakes');
      judge(traction.get(v), pros, cons, 'Great grip and handling', 'Poor grip and handling');
      judge(price.get(v), pros, cons, `Cheaper than most ${group}`, `One of the most expensive ${group}`);

      const shops = v.upgradeShops ?? [];
      if (v.hswTopSpeedMph) pros.push(`Hao's Special Works upgrade raises top speed to ${v.hswTopSpeedMph} mph`);
      if (shops.includes('Weaponized')) pros.push('Has weapons');
      if (shops.includes('Imani Tech')) pros.push('Imani Tech upgrades available (e.g. missile lock-on jammer)');
      if (shops.includes("Benny's Original Motor Works")) pros.push("Can be customised further at Benny's");
      if (v.upgradeShops && shops.length === 0) cons.push("Can't be modified");
      if (v.price == null) cons.push("Can't be bought — found or unlocked only");
      ensureBoth(
        [
          { pl: lap.get(v), name: 'lap time' },
          { pl: speed.get(v), name: 'top speed' },
          { pl: accel.get(v), name: 'acceleration' },
          { pl: braking.get(v), name: 'braking' },
          { pl: traction.get(v), name: 'handling' },
        ],
        pros,
        cons,
        group,
      );

      out.set(v.id, {
        stars: toStars(main.p),
        basis: `${by === 'lap time' ? 'Lap time' : by === 'top speed' ? 'Top speed' : 'Average of the in-game stat bars'} compared with other ${group}`,
        rank: { position: main.position, total: main.total, label: `${group} by ${by}` },
        pros,
        cons,
      });
    }
    return out;
  });
}
