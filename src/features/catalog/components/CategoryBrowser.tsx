'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useMode } from '@/features/mode/ModeProvider';
import { prepare, searchPrepared } from '@/features/search/lib/engine';
import { EmptyState } from '@/shared/components/EmptyState';
import { applyFilters, facetOptions, inMode, sortCards } from '../lib/filtering';
import type { CardModel, CategoryMeta } from '../types';
import { CardGrid } from './CardGrid';
import { CategoryIcon } from './CategoryIcon';
import { FilterBar } from './FilterBar';
import styles from './CategoryBrowser.module.css';

// Picture grids stop at 300 cards to stay fast; compact lists can show everything.
const GRID_LIMIT = 300;

/** Browse one category: in-page search, filter menus and sort. */
export function CategoryBrowser({ meta, cards }: { meta: CategoryMeta; cards: CardModel[] }) {
  const { mode } = useMode();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortIndex, setSortIndex] = useState(0);
  const [q, setQ] = useState('');
  const prepared = useMemo(() => prepare(cards), [cards]);

  const pool = useMemo(() => cards.filter((c) => inMode(c, mode)), [cards, mode]);
  const shown = useMemo(() => {
    const filtered = applyFilters(pool, filters);
    if (q.trim()) {
      const allowed = new Set(filtered.map((c) => c.key));
      return searchPrepared(prepared, q).map((h) => h.item).filter((c) => allowed.has(c.key));
    }
    return sortCards(filtered, meta.sorts[sortIndex]);
  }, [pool, filters, q, prepared, meta.sorts, sortIndex]);

  // Each filter's counts reflect the other active filters, so options never lead to empty results.
  const filterOptions = meta.filters.map((def) => {
    const others = Object.fromEntries(Object.entries(filters).filter(([k]) => k !== def.key));
    return { def, options: facetOptions(applyFilters(pool, others), def.key) };
  });
  const LIMIT = meta.layout === 'list' ? 2000 : GRID_LIMIT;
  const numbered = meta.key === 'missions' && !q.trim() && meta.sorts[sortIndex]?.key === 'order';

  return (
    <>
      <header className={styles.head}>
        <div className={styles.titleRow}>
          <span className={styles.icon}>
            <CategoryIcon cat={meta.key} size={22} />
          </span>
          <div>
            <h1>{meta.label}</h1>
            <p>{meta.blurb}</p>
          </div>
        </div>
        <label className={styles.quick}>
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${meta.label.toLowerCase()}`}
            aria-label={`Search ${meta.label}`}
          />
        </label>
      </header>

      <FilterBar
        filters={filterOptions}
        selected={filters}
        onFilter={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
        sorts={q.trim() ? [] : meta.sorts}
        sortIndex={sortIndex}
        onSort={setSortIndex}
        onReset={() => setFilters({})}
      />

      <p className={styles.status} aria-live="polite">
        <strong>{shown.length}</strong> {shown.length === 1 ? 'result' : 'results'}
        {mode !== 'all' && <span> · {mode === 'Online' ? 'GTA Online' : 'Story mode'} only</span>}
        {shown.length > LIMIT && <span> · showing first {LIMIT}</span>}
      </p>

      {shown.length ? (
        <CardGrid cards={shown} categories={[meta]} layout={meta.layout} query={q} limit={LIMIT} numberBy={numbered ? 'order' : undefined} />
      ) : (
        <EmptyState title="No matches">
          {pool.length ? 'Try removing a filter or searching for something else.' : 'Nothing in this category for the selected game mode.'}
        </EmptyState>
      )}
    </>
  );
}
