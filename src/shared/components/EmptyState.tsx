import type { ReactNode } from 'react';
import styles from './ui.module.css';

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className={styles.empty}>
      <strong>{title}</strong>
      {children}
    </div>
  );
}
