'use client';

import Link from 'next/link';
import { useMode } from '@/features/mode/ModeProvider';
import { useSearchIndex } from '@/features/search/SearchIndexProvider';
import { CategoryIcon } from './CategoryIcon';
import styles from './CategoryTiles.module.css';

/** Grid of categories with live counts for the selected game mode. */
export function CategoryTiles() {
  const { mode } = useMode();
  const { counts, categories } = useSearchIndex();
  const current = counts[mode];
  return (
    <div className={styles.tiles}>
      {categories
        .filter((m) => current[m.key])
        .map((m) => (
          <Link key={m.key} href={`/${m.key}`} className={styles.tile}>
            <span className={styles.icon}>
              <CategoryIcon cat={m.key} size={20} />
            </span>
            <span className={styles.text}>
              <span className={styles.lbl}>
                {m.label} <span className={styles.num}>{current[m.key]}</span>
              </span>
              <span className={styles.blurb}>{m.blurb}</span>
            </span>
          </Link>
        ))}
    </div>
  );
}
