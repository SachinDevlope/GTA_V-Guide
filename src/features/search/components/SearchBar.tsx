'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ItemMedia } from '@/features/catalog/components/ItemMedia';
import { CategoryIcon } from '@/features/catalog/components/CategoryIcon';
import { highlight } from '../lib/highlight';
import { rememberRecent, useRecentSearches } from '../hooks/useRecentSearches';
import { useSuggestions, type SuggestionRow } from '../hooks/useSuggestions';
import { useSearchIndex } from '../SearchIndexProvider';
import styles from './SearchBar.module.css';

/** Search box with live suggestions, top searches and recent searches. */
export function SearchBar({ size = 'compact', autoFocus = false }: { size?: 'compact' | 'hero'; autoFocus?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const { recent, refresh, clear } = useRecentSearches();
  const { categories, ready, load } = useSearchIndex();
  const sections = useSuggestions(query, recent);
  const rows = useMemo(() => sections.flatMap((s) => s.rows), [sections]);
  const colorOf = useMemo(() => new Map(categories.map((c) => [c.key, c])), [categories]);

  // Keep the box in sync when navigating to /search?q=…
  useEffect(() => setQuery(params.get('q') ?? ''), [params]);
  useEffect(() => setActive(-1), [query]);

  // "/" focuses search from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const runQuery = (q: string) => {
    const trimmed = q.trim();
    setOpen(false);
    if (!trimmed) return;
    rememberRecent({ q: trimmed });
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const pick = (row: SuggestionRow | undefined) => {
    if (!row) return runQuery(query);
    setOpen(false);
    inputRef.current?.blur();
    if (row.kind === 'item') {
      rememberRecent({ key: row.card.key });
      router.push(row.card.href);
    } else if (row.kind === 'category') {
      router.push(`/${row.meta.key}`);
    } else {
      setQuery(row.q);
      runQuery(row.q);
    }
  };

  const renderRow = (row: SuggestionRow) => {
    if (row.kind === 'item') {
      const meta = colorOf.get(row.card.cat);
      return (
        <>
          <ItemMedia cat={row.card.cat} image={row.card.image} alt="" variant="thumb" />
          <span className={styles.text}>
            <span className={styles.name}>{highlight(row.card.name, query)}</span>
            <span className={styles.sub}>{row.card.subtitle}</span>
          </span>
          <span className={styles.badge}>{meta?.short}</span>
        </>
      );
    }
    if (row.kind === 'category') {
      return (
        <>
          <span className={styles.iconBox}>
            <CategoryIcon cat={row.meta.key} size={18} />
          </span>
          <span className={styles.text}>
            <span className={styles.name}>Browse all {row.meta.label}</span>
          </span>
          <span className={styles.badge}>{row.count}</span>
        </>
      );
    }
    return (
      <>
        <span className={styles.iconBox}>
          <Search size={16} aria-hidden="true" />
        </span>
        <span className={styles.text}>
          <span className={styles.name}>{row.recent ? row.q : `See all ${row.total ?? 0} results for “${row.q}”`}</span>
        </span>
        <span className={styles.badge}>{row.recent ? 'Recent' : '↵'}</span>
      </>
    );
  };

  let index = -1;
  return (
    <div className={`${styles.search} ${size === 'hero' ? styles.hero : ''}`}>
      <Search className={styles.icon} size={size === 'hero' ? 20 : 17} aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        autoComplete="off"
        spellCheck={false}
        autoFocus={autoFocus}
        placeholder={size === 'hero' ? 'Try “Zentorno”, “Cayo Perico” or “painkiller”' : 'Search anything…'}
        aria-label="Search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          load();
          refresh();
          setOpen(true);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
            setActive((a) => (rows.length ? (a + 1) % rows.length : -1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((a) => (rows.length ? (a - 1 + rows.length) % rows.length : -1));
          } else if (e.key === 'Enter') {
            e.preventDefault();
            pick(active >= 0 ? rows[active] : undefined);
          } else if (e.key === 'Escape') {
            setOpen(false);
          }
        }}
      />
      <kbd className={styles.kbd}>/</kbd>
      {open && !ready && query.trim() && (
        <div className={styles.panel}>
          <div className={styles.head}>Loading search index…</div>
        </div>
      )}
      {open && ready && rows.length > 0 && (
        <div id={listId} role="listbox" className={styles.panel} onMouseDown={(e) => e.preventDefault()}>
          {sections.map((section, si) => (
            <div key={si}>
              <div className={section.title ? styles.head : styles.divider}>
                {section.title}
                {section.clearable && (
                  <button type="button" className={styles.clear} onClick={clear}>
                    Clear
                  </button>
                )}
              </div>
              {section.rows.map((row) => {
                index += 1;
                const i = index;
                return (
                  <div
                    key={i}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    className={`${styles.row} ${i === active ? styles.active : ''}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => pick(row)}
                  >
                    {renderRow(row)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
