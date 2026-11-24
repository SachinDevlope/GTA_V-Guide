import { Check, Gift, Info, Trophy } from 'lucide-react';
import { money } from '@/shared/lib/format';
import type { HeistElite as Elite } from '../types';
import styles from './HeistElite.module.css';

/** Elite Challenge checklist, its bonus and the total take after completing it. */
export function HeistElite({ elite }: { elite: Elite }) {
  const same = elite.eliteBonus.normal != null && elite.eliteBonus.normal === elite.eliteBonus.hard;
  const bonus = same
    ? [{ label: 'Any difficulty', value: money(elite.eliteBonus.normal)! }]
    : ([
    elite.eliteBonus.normal != null && { label: 'Normal', value: money(elite.eliteBonus.normal) },
    elite.eliteBonus.hard != null && { label: 'Hard', value: money(elite.eliteBonus.hard) },
  ].filter(Boolean) as { label: string; value: string }[]);
  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.box}>
          <h3>Challenges</h3>
          <ul className={styles.checks}>
            {elite.challenges.map((c) => (
              <li key={c}>
                <Check size={15} aria-hidden="true" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={`${styles.box} ${styles.pay}`}>
          <h3>
            <Trophy size={15} aria-hidden="true" /> Elite bonus
          </h3>
          {bonus.length > 0 ? (
            <dl className={styles.bonus}>
              {bonus.map((b) => (
                <div key={b.label}>
                  <dt>{b.label}</dt>
                  <dd>{b.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {elite.eliteBonus.text && <p className={styles.small}>{elite.eliteBonus.text}</p>}
          {elite.repeatable != null && (
            <p className={styles.small}>{elite.repeatable ? 'Paid every time you complete it.' : 'Paid once (first completion only).'}</p>
          )}
          {elite.totalAfterElite && (
            <div className={styles.total}>
              <span>Total with Elite</span>
              <strong>{elite.totalAfterElite}</strong>
            </div>
          )}
        </div>
      </div>
      {elite.oneTimeBonuses.length > 0 && (
        <ul className={styles.extras}>
          {elite.oneTimeBonuses.map((b) => (
            <li key={b.name}>
              <Gift size={15} aria-hidden="true" />
              <span>
                <strong>
                  {b.name}
                  {b.amount != null && <em>{money(b.amount)}</em>}
                </strong>
                {b.text && <span>{b.text}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
      {elite.note && (
        <div className={styles.note}>
          <Info size={15} aria-hidden="true" />
          <p>
            <strong>How it is worked out</strong>
            {elite.note}
          </p>
        </div>
      )}
    </div>
  );
}
