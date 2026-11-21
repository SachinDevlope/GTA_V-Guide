'use client';

import { useMemo } from 'react';
import { inMode } from '@/features/catalog/lib/filtering';
import type { CardModel, CategoryMeta } from '@/features/catalog/types';
import { useMode } from '@/features/mode/ModeProvider';
import { EXACT_NAME_SCORE, searchPrepared } from '../lib/engine';
import { normalize, tokenize } from '../lib/normalize';
import { POPULAR_SEARCHES } from '../popular';
import { useSearchIndex } from '../SearchIndexProvider';
import type { RecentEntry } from './useRecentSearches';

export type SuggestionRow =
  | { kind: 'item'; card: CardModel; recent?: boolean }
  | { kind: 'query'; q: string; recent?: boolean; total?: number }
  | { kind: 'category'; meta: CategoryMeta; count: number };

export interface SuggestionSection {
  title: string;
  rows: SuggestionRow[];
  clearable?: boolean;
}

/** Builds the dropdown content for the search box. */
export function useSuggestions(query: string, recent: RecentEntry[]): SuggestionSection[] {
  const { prepared, byKey, counts, categories } = useSearchIndex();
  const { mode } = useMode();

  return useMemo(() => {
    const tokens = tokenize(query);
    const pool = prepared.filter((p) => inMode(p.item, mode));

    if (!tokens.length) {
      const sections: SuggestionSection[] = [];
      const recentRows: SuggestionRow[] = recent.flatMap((r): SuggestionRow[] => {
        if ('key' in r) {
          const card = byKey.get(r.key);
          return card ? [{ kind: 'item', card, recent: true }] : [];
        }
        return [{ kind: 'query', q: r.q, recent: true }];
      });
      if (recentRows.length) sections.push({ title: 'Recent', rows: recentRows, clearable: true });

      const seen = new Set(recentRows.flatMap((r) => (r.kind === 'item' ? [r.card.key] : [])));
      const popular: SuggestionRow[] = [];
      for (const name of POPULAR_SEARCHES) {
        const exact = pool.find((p) => normalize(p.item.name) === normalize(name));
        const card = exact?.item ?? searchPrepared(pool, name).find((h) => h.score >= EXACT_NAME_SCORE)?.item;
        if (card && !seen.has(card.key)) {
          seen.add(card.key);
          popular.push({ kind: 'item', card });
        }
        if (popular.length >= 8) break;
      }
      if (popular.length) sections.push({ title: 'Top searches', rows: popular });
      return sections;
    }

    const hits = searchPrepared(pool, query);
    const first = tokens[0];
    const categoryRows: SuggestionRow[] =
      first.length >= 3
        ? categories
            .filter((m) => normalize(m.label).split(' ').some((w) => w.startsWith(first)))
            .map((meta) => ({
              kind: 'category' as const,
              meta,
              count: counts[mode][meta.key] ?? 0,
            }))
            .filter((r) => r.count > 0)
        : [];

    return [
      {
        title: hits.length ? 'Best matches' : 'No direct matches',
        rows: hits.slice(0, 7).map((h) => ({ kind: 'item' as const, card: h.item })),
      },
      { title: '', rows: [...categoryRows, { kind: 'query', q: query.trim(), total: hits.length }] },
    ];
  }, [query, recent, prepared, byKey, counts, categories, mode]);
}
