import { Coins, Star } from 'lucide-react';
import { money } from '@/shared/lib/format';
import { bestLevel, profitPerHour } from '../lib/levels';
import type { BusinessUpgrade, IncomeLevel, PassiveIncome } from '../types';
import styles from './IncomeLevels.module.css';

const hours = (h: number | null) => {
  if (h == null) return null;
  const whole = Math.floor(h);
  const mins = Math.round((h - whole) * 60);
  return mins ? `${whole}h ${mins}m` : `${whole}h`;
};

interface Props {
  levels: IncomeLevel[];
  upgrades: BusinessUpgrade[];
  passive: PassiveIncome | null;
}

/** Income at each upgrade level as small boxes, the upgrades that change it, and any passive payout. */
export function IncomeLevels({ levels, upgrades, passive }: Props) {
  const best = levels.length > 1 ? bestLevel(levels) : null;
  return (
    <div className={styles.wrap}>
      <p className={styles.hint}>All times are real-world time (one in-game day is 48 real minutes).</p>
      {levels.length > 0 && (
        <ul className={styles.grid}>
          {levels.map((l) => {
            const profit = profitPerHour(l);
            const facts: [string, string | null][] = [
              ['Per unit', money(l.unitValue)],
              ['Full stock', money(l.fullStockValue)],
              ['Selling far / bonus', money(l.fullStockValueFar)],
              ['Time to fill', hours(l.timeToFullHours)],
              ['Supplies (full stock)', money(l.supplyCost)],
              ['Profit after supplies', profit != null ? `${money(profit)}/hr` : null],
            ];
            return (
              <li key={l.level} className={l === best ? `${styles.box} ${styles.best}` : styles.box}>
                <div className={styles.head}>
                  <span className={styles.level}>{l.level}</span>
                  {l === best && (
                    <span className={styles.tag}>
                      <Star size={11} fill="currentColor" strokeWidth={0} aria-hidden="true" /> Best
                    </span>
                  )}
                </div>
                <div className={styles.rate}>
                  {l.perHour != null ? (
                    <>
                      {money(l.perHour)}
                      <small>/hr</small>
                    </>
                  ) : (
                    <small>Per job / per sale</small>
                  )}
                </div>
                <dl className={styles.facts}>
                  {facts
                    .filter((f): f is [string, string] => f[1] != null)
                    .map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd className={k === 'Profit after supplies' ? (profit != null && profit < 0 ? styles.loss : styles.money) : undefined}>{v}</dd>
                      </div>
                    ))}
                </dl>
                {l.note && <p className={styles.note}>{l.note}</p>}
              </li>
            );
          })}
        </ul>
      )}

      {upgrades.length > 0 && (
        <>
          <h3 className={styles.sub}>Upgrades</h3>
          <ul className={styles.upgrades}>
            {upgrades.map((u) => (
              <li key={u.name}>
                <div className={styles.head}>
                  <strong>{u.name}</strong>
                  <span className={styles.money}>{money(u.price) ?? '—'}</span>
                </div>
                <span>{u.effect}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {passive && (
        <div className={styles.passive}>
          <Coins size={18} aria-hidden="true" />
          <span>
            <strong>{passive.source}</strong>
            <span>
              {[
                passive.maxPerDay != null && `up to ${money(passive.maxPerDay)} every 48 real minutes (about ${money((passive.maxPerDay * 60) / 48)}/hr)`,
                passive.maxStored != null && `holds up to ${money(passive.maxStored)}`,
                passive.requirement,
              ]
                .filter(Boolean)
                .join(' · ')}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
