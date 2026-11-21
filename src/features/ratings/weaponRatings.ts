import type { Weapon } from '@/features/weapons/types';
import { ensureBoth, judge, memoRatings, placements, toStars } from './lib/score';
import type { Rating } from './types';

/** Items that barely hurt anyone (ball, flare, jerry can, snowballs, stun gun) are utilities, not rated as weapons. */
export const isUtility = (w: Weapon) => (w.stats?.damage ?? 0) <= 1;

/** One number per weapon: damage matters most, then fire rate, accuracy and range. */
function weaponScore(w: Weapon): number | null {
  const s = w.stats;
  if (!s || s.damage == null || isUtility(w)) return null;
  if (w.category === 'Melee') return 0.75 * s.damage + 0.25 * (s.fireRate ?? 0);
  return 0.4 * s.damage + 0.25 * (s.fireRate ?? 0) + 0.2 * (s.accuracy ?? 0) + 0.15 * (s.range ?? 0);
}

/** Weapons are rated against others of the same category (a pistol is compared with pistols). */
export function weaponRatings(weapons: Weapon[]) {
  return memoRatings<Weapon>(() => {
    const cat = (w: Weapon) => w.category;
    const overall = placements(weapons.filter((w) => !isUtility(w)), cat, weaponScore);
    // Compare only real weapons with each other (utilities are left out of every ranking).
    const combat = weapons.filter((w) => !isUtility(w));
    const damage = placements(combat, cat, (w) => w.stats?.damage);
    const fire = placements(combat, cat, (w) => w.stats?.fireRate);
    const acc = placements(combat, cat, (w) => w.stats?.accuracy);
    const range = placements(combat, cat, (w) => w.stats?.range);
    const byId = new Map(weapons.map((w) => [w.id, w]));

    const out = new Map<string, Rating>();
    for (const w of weapons) {
      const main = overall.get(w);
      if (!main) continue;
      const group = w.category;
      const pros: string[] = [];
      const cons: string[] = [];

      judge(damage.get(w), pros, cons, `High damage for ${group} (${w.stats?.damage})`, `Low damage for ${group} (${w.stats?.damage})`);
      judge(fire.get(w), pros, cons, w.category === 'Melee' ? 'Fast swings' : `Fast fire rate for ${group}`, w.category === 'Melee' ? 'Slow swings' : `Slow fire rate for ${group}`);
      const melee = w.category === 'Melee';
      // Melee weapons have no real accuracy or range, so they are judged on damage and swing speed only.
      if (!melee) judge(acc.get(w), pros, cons, `Accurate for ${group}`, `Inaccurate for ${group}`);
      if (!melee) judge(range.get(w), pros, cons, `Long range for ${group}`, `Short range for ${group}`);

      if (w.upgradesTo) pros.push(`Can be upgraded to the ${byId.get(w.upgradesTo)?.name ?? 'Mk II'}`);
      if (w.mk2) pros.push('Mk II: special ammo, extra sights and camo liveries');
      if ((w.attachments?.length ?? 0) >= 4) pros.push(`Lots of attachments (${w.attachments!.length})`);
      if (w.availability === 'Online') cons.push('Only available in GTA Online');
      ensureBoth(
        [
          { pl: damage.get(w), name: 'damage' },
          { pl: fire.get(w), name: 'fire rate' },
          ...(w.category === 'Melee'
            ? []
            : [
                { pl: acc.get(w), name: 'accuracy' },
                { pl: range.get(w), name: 'range' },
              ]),
        ],
        pros,
        cons,
        group,
      );

      out.set(w.id, {
        stars: toStars(main.p),
        basis: `Damage, fire rate, accuracy and range compared with other ${group}`,
        rank: { position: main.position, total: main.total, label: `${group} overall` },
        pros,
        cons,
      });
    }
    return out;
  });
}
