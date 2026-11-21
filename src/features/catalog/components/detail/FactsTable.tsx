import type { Fact } from '../../types';
import { Linked } from './Linked';
import styles from './detail.module.css';

/** Every fact as label / value rows, two columns on wide screens. */
export function FactsTable({ facts }: { facts: Fact[] }) {
  if (!facts.length) return null;
  return (
    <dl className={styles.table}>
      {facts.map((f) => (
        <div key={f.label} className={styles.tableRow}>
          <dt>{f.label}</dt>
          <dd>{f.link ? <Linked text={String(f.value)} /> : f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
