'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'lsindex-recent';
const MAX = 6;

/** A recent search is either a typed query or an item that was opened. */
export type RecentEntry = { q: string } | { key: string };

const read = (): RecentEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const write = (list: RecentEntry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* storage blocked */
  }
};

const idOf = (e: RecentEntry) => ('key' in e ? 'k:' + e.key : 'q:' + e.q.toLowerCase());

/** Adds an entry to the recent list (usable outside React, e.g. from event handlers). */
export function rememberRecent(entry: RecentEntry) {
  const list = read().filter((e) => idOf(e) !== idOf(entry));
  list.unshift(entry);
  write(list.slice(0, MAX));
}

export function useRecentSearches() {
  const [recent, setRecent] = useState<RecentEntry[]>([]);
  const refresh = useCallback(() => setRecent(read()), []);
  useEffect(refresh, [refresh]);
  const clear = useCallback(() => {
    write([]);
    setRecent([]);
  }, []);
  return { recent, refresh, clear };
}
