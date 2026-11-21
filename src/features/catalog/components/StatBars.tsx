import type { CSSProperties } from 'react';
import type { StatBar } from '../types';
import styles from './StatBars.module.css';

const pct = (n: number) => `${Math.max(0, Math.min(100, n))}%`;

/** In-game style 0–100 bars. When upgraded values exist, a lighter bar shows the gain. */
export function StatBars({ stats }: { stats: StatBar[] }) {
  const hasUpgrades = stats.some((s) => typeof s.upgraded === 'number');
  return (
    <section className={styles.box} aria-label="Stats">
      {hasUpgrades && (
        <div className={styles.legend}>
          <span>
            <i className={styles.keyStock} /> Stock
          </span>
          <span>
            <i className={styles.keyUp} /> Fully upgraded
          </span>
        </div>
      )}
      {stats.map((s) => {
        const up = typeof s.upgraded === 'number' && s.upgraded > (s.value ?? 0) ? s.upgraded : null;
        return (
          <div key={s.label}>
            <div className={styles.top}>
              <span>{s.label}</span>
              <span className={styles.num}>
                {s.value}
                {up != null && <span className={styles.gain}> → {up}</span>}
              </span>
            </div>
            <div className={styles.track} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={s.value!} aria-label={s.label}>
              {up != null && <div className={styles.upFill} style={{ '--w': pct(up) } as CSSProperties} />}
              <div className={styles.fill} style={{ '--w': pct(s.value!) } as CSSProperties} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
