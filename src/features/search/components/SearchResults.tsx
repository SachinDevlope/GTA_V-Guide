'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CardGrid } from '@/features/catalog/components/CardGrid';
import { inMode } from '@/features/catalog/lib/filtering';
import type { CategoryKey } from '@/features/catalog/types';
import { useMode } from '@/features/mode/ModeProvider';
import { EmptyState } from '@/shared/components/EmptyState';
import { searchPrepared } from '../lib/engine';
import { useLoadedSearchIndex } from '../SearchIndexProvider';
import styles from './SearchResults.module.css';

/** Results page for /search?q=… with tabs to narrow by category. */
export function SearchResults() {
  const q = useSearchParams().get('q') ?? '';
  const { prepared, categories, ready } = useLoadedSearchIndex();
  const { mode } = useMode();
  const [cat, setCat] = useState<CategoryKey | 'all'>('all');

  const hits = useMemo(
    () => searchPrepared(prepared.filter((p) => inMode(p.item, mode)), q).map((h) => h.item),
    [prepared, q, mode],
  );
  const counts = useMemo(() => {
    const c: Partial<Record<CategoryKey, number>> = {};
    for (const h of hits) c[h.cat] = (c[h.cat] ?? 0) + 1;
    return c;
  }, [hits]);
  const shown = cat === 'all' ? hits : hits.filter((h) => h.cat === cat);

  if (!q.trim()) return <EmptyState title="Type something to search">Try a mission, car, weapon, cheat or character.</EmptyState>;
  if (!ready) return <p className={styles.loading}>Searching…</p>;

  return (
    <>
      <header className={styles.head}>
        <h1>
          Results for <span>“{q}”</span>
        </h1>
        <p>{hits.length} matches</p>
      </header>
      <div className={styles.tabs} role="tablist" aria-label="Narrow by category">
        <button type="button" role="tab" aria-selected={cat === 'all'} onClick={() => setCat('all')}>
          All <span>{hits.length}</span>
        </button>
        {categories
          .filter((m) => counts[m.key])
          .map((m) => (
            <button key={m.key} type="button" role="tab" aria-selected={cat === m.key} onClick={() => setCat(m.key)}>
              {m.short} <span>{counts[m.key]}</span>
            </button>
          ))}
      </div>
      {shown.length ? (
        <CardGrid cards={shown} categories={categories} showLabels={cat === 'all'} query={q} />
      ) : (
        <EmptyState title="No matches">
          Try fewer words or another spelling{mode !== 'all' ? ', or switch the game mode to “All”' : ''}.
        </EmptyState>
      )}
    </>
  );
}
