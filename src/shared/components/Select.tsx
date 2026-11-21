'use client';

import { Check, ChevronDown, Search, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  /** How many items this option would show (optional). */
  count?: number;
}

interface Props {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  /** Text for the empty value, e.g. "All". Omit for selects that always have a value (like sort). */
  emptyLabel?: string;
  /** Show a search box inside the menu. Defaults to on for long lists. */
  searchable?: boolean;
}

/**
 * Pill-shaped dropdown with a popover menu: optional search, counts, check mark,
 * full keyboard support (arrows, Home/End, Enter, Esc) and a clear button when active.
 */
export function Select({ label, value, options, onChange, emptyLabel, searchable }: Props) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [alignRight, setAlignRight] = useState(false);

  const allOptions = useMemo<SelectOption[]>(
    () => (emptyLabel !== undefined ? [{ value: '', label: emptyLabel }, ...options] : options),
    [options, emptyLabel],
  );
  const showSearch = searchable ?? options.length > 8;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? allOptions.filter((o) => o.label.toLowerCase().includes(q)) : allOptions;
  }, [allOptions, query]);

  const selected = allOptions.find((o) => o.value === value);
  const isActive = emptyLabel !== undefined && value !== '';

  const openMenu = () => {
    const rect = rootRef.current?.getBoundingClientRect();
    setAlignRight(Boolean(rect && rect.left + 280 > window.innerWidth));
    setQuery('');
    setActive(Math.max(0, allOptions.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };
  const choose = (v: string) => {
    onChange(v);
    close();
  };

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Focus the search box (or the list) when opening.
  useEffect(() => {
    if (open) (showSearch ? searchRef.current : listRef.current)?.focus();
  }, [open, showSearch]);

  // Keep the highlighted option in view.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const onMenuKey = (e: KeyboardEvent) => {
    const last = filtered.length - 1;
    if (e.key === 'ArrowDown') setActive((a) => Math.min(last, a + 1));
    else if (e.key === 'ArrowUp') setActive((a) => Math.max(0, a - 1));
    else if (e.key === 'Home') setActive(0);
    else if (e.key === 'End') setActive(last);
    else if (e.key === 'Enter' && filtered[active]) choose(filtered[active].value);
    else if (e.key === 'Escape') close();
    else if (e.key === 'Tab') close(false);
    else return;
    e.preventDefault();
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.trigger} ${isActive ? styles.on : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={(e) => {
          if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault();
            openMenu();
          }
        }}
      >
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{selected?.label ?? emptyLabel}</span>
        <ChevronDown size={15} className={styles.chev} aria-hidden="true" />
      </button>
      {isActive && (
        <button type="button" className={styles.clear} aria-label={`Clear ${label}`} onClick={() => onChange('')}>
          <X size={13} aria-hidden="true" />
        </button>
      )}

      {open && (
        <div className={`${styles.menu} ${alignRight ? styles.right : ''}`} onKeyDown={onMenuKey}>
          {showSearch && (
            <div className={styles.search}>
              <Search size={15} aria-hidden="true" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder={`Search ${label.toLowerCase()}…`}
                aria-label={`Search ${label}`}
                aria-controls={`${id}-list`}
                aria-activedescendant={filtered[active] ? `${id}-${active}` : undefined}
              />
            </div>
          )}
          <ul
            ref={listRef}
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            tabIndex={-1}
            className={styles.list}
            aria-activedescendant={filtered[active] ? `${id}-${active}` : undefined}
          >
            {filtered.map((o, i) => {
              const isSel = o.value === value;
              return (
                <li
                  key={o.value || '__empty'}
                  id={`${id}-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={isSel}
                  className={`${styles.option} ${i === active ? styles.hl : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(o.value)}
                >
                  <Check size={15} className={styles.check} aria-hidden="true" style={{ visibility: isSel ? 'visible' : 'hidden' }} />
                  <span className={styles.optLabel}>{o.label}</span>
                  {o.count !== undefined && <span className={styles.count}>{o.count}</span>}
                </li>
              );
            })}
            {!filtered.length && <li className={styles.none}>No matches</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
