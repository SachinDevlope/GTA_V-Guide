import type { Fact } from '../../types';
import { Linked } from './Linked';
import styles from './detail.module.css';

/** The most important facts as big tiles (2 per row). */
export function KeyFactTiles({ facts }: { facts: Fact[] }) {
  if (!facts.length) return null;
  return (
    <dl className={styles.tiles}>
      {facts.map((f) => (
        <div key={f.label} className={styles.tile}>
          <dt>{f.label}</dt>
          <dd>{f.link ? <Linked text={String(f.value)} /> : f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
