import { Check, X } from 'lucide-react';
import styles from './ProsCons.module.css';

/** Two columns: what's good and what's not. */
export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  if (!pros.length && !cons.length) return null;
  return (
    <div className={styles.prosCons}>
      <div className={`${styles.pcCol} ${styles.pros}`}>
        <h3>Pros</h3>
        {pros.length ? (
          <ul>
            {pros.map((p) => (
              <li key={p}>
                <Check size={16} aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.pcNone}>Nothing stands out.</p>
        )}
      </div>
      <div className={`${styles.pcCol} ${styles.cons}`}>
        <h3>Cons</h3>
        {cons.length ? (
          <ul>
            {cons.map((c) => (
              <li key={c}>
                <X size={16} aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.pcNone}>No real weak spots.</p>
        )}
      </div>
    </div>
  );
}
