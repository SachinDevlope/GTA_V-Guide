import { Sparkles } from 'lucide-react';
import { money } from '@/shared/lib/format';
import type { RecommendationBlock } from '../../types';
import styles from './Recommendations.module.css';

/** "Best picks" in one box: numbered rows with optional prices, then a totals strip. */
export function Recommendations({ block }: { block: RecommendationBlock }) {
  return (
    <div className={styles.box}>
      {block.highlight && (
        <div className={styles.head}>
          <span className={styles.highlight}>
            <Sparkles size={15} aria-hidden="true" />
            {block.highlight}
          </span>
        </div>
      )}
      <ol className={styles.list}>
        {block.items.map((r, i) => (
          <li key={r.name} className={styles.row}>
            <span className={styles.num}>{i + 1}</span>
            <span className={styles.text}>
              <span className={styles.name}>{r.name}</span>
              <span className={styles.why}>{r.why}</span>
            </span>
            {typeof r.price === 'number' && <span className={styles.price}>{money(r.price)}</span>}
          </li>
        ))}
      </ol>
      {block.summary && block.summary.length > 0 && (
        <dl className={styles.summary}>
          {block.summary.map((s) => (
            <div key={s.label} className={s.strong ? styles.strong : undefined}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {block.note && <p className={styles.note}>{block.note}</p>}
    </div>
  );
}
