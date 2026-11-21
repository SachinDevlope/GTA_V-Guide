import type { ReactNode } from 'react';
import styles from './detail.module.css';

/** A titled block below the hero (About, Details, Upgrades…). */
export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
