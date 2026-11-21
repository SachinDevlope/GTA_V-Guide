'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { CountsByMode } from '@/features/catalog/lib/cards';
import type { CardModel, CategoryMeta } from '@/features/catalog/types';
import { prepare, type Prepared } from './lib/engine';

const INDEX_URL = '/search-index.json';

interface SearchIndex {
  /** False until the index has been downloaded. */
  ready: boolean;
  cards: CardModel[];
  prepared: Prepared<CardModel>[];
  byKey: Map<string, CardModel>;
  categories: CategoryMeta[];
  counts: CountsByMode;
  /** Starts the download if it hasn't started yet. */
  load: () => void;
}

const SearchIndexContext = createContext<SearchIndex | null>(null);

/**
 * Provides category info and item counts immediately, and the full search index
 * (every item's card) lazily from /search-index.json so pages stay small.
 */
export function SearchIndexProvider({
  categories,
  counts,
  children,
}: {
  categories: CategoryMeta[];
  counts: CountsByMode;
  children: ReactNode;
}) {
  const [cards, setCards] = useState<CardModel[] | null>(null);
  const started = useRef(false);

  const load = useCallback(() => {
    if (started.current) return;
    started.current = true;
    fetch(INDEX_URL)
      .then((r) => r.json() as Promise<CardModel[]>)
      .then(setCards)
      .catch(() => {
        started.current = false; // allow a retry on the next interaction
      });
  }, []);

  // Fetch in the background once the page is idle, so search feels instant later.
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(load);
    else setTimeout(load, 1500);
  }, [load]);

  const value = useMemo<SearchIndex>(() => {
    const list = cards ?? [];
    return {
      ready: cards !== null,
      cards: list,
      prepared: prepare(list),
      byKey: new Map(list.map((c) => [c.key, c])),
      categories,
      counts,
      load,
    };
  }, [cards, categories, counts, load]);

  return <SearchIndexContext.Provider value={value}>{children}</SearchIndexContext.Provider>;
}

export function useSearchIndex(): SearchIndex {
  const ctx = useContext(SearchIndexContext);
  if (!ctx) throw new Error('useSearchIndex must be used inside SearchIndexProvider');
  return ctx;
}

/** Same as useSearchIndex, but also makes sure the index starts downloading. */
export function useLoadedSearchIndex(): SearchIndex {
  const ctx = useSearchIndex();
  useEffect(() => ctx.load(), [ctx]);
  return ctx;
}
