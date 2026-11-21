'use client';

import { RotateCcw } from 'lucide-react';
import { Select, type SelectOption } from '@/shared/components/Select';
import type { FilterDef, SortDef } from '../types';
import styles from './FilterBar.module.css';

interface Props {
  filters: { def: FilterDef; options: SelectOption[] }[];
  selected: Record<string, string>;
  onFilter: (key: string, value: string) => void;
  sorts?: SortDef[];
  sortIndex?: number;
  onSort?: (index: number) => void;
  onReset: () => void;
}

/** Filter pills plus a sort menu. Filters with fewer than two options are hidden. */
export function FilterBar({ filters, selected, onFilter, sorts = [], sortIndex = 0, onSort, onReset }: Props) {
  const visible = filters.filter((f) => f.options.length > 1);
  const anyActive = Object.values(selected).some(Boolean);
  if (!visible.length && sorts.length < 2) return null;
  return (
    <div className={styles.bar}>
      <div className={styles.filters}>
        {visible.map(({ def, options }) => (
          <Select
            key={def.key}
            label={def.label}
            value={selected[def.key] ?? ''}
            options={options}
            emptyLabel="All"
            onChange={(v) => onFilter(def.key, v)}
          />
        ))}
        {anyActive && (
          <button type="button" className={styles.reset} onClick={onReset}>
            <RotateCcw size={14} aria-hidden="true" /> Reset
          </button>
        )}
      </div>
      {sorts.length > 1 && onSort && (
        <Select
          label="Sort"
          value={String(sortIndex)}
          options={sorts.map((s, i) => ({ value: String(i), label: s.label }))}
          onChange={(v) => onSort(Number(v))}
          searchable={false}
        />
      )}
    </div>
  );
}
