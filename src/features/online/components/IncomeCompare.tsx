'use client';

import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ItemMedia } from '@/features/catalog/components/ItemMedia';
import { money } from '@/shared/lib/format';
import type { IncomeRow } from '../lib/income';
import styles from './IncomeCompare.module.css';

type Key = 'name' | 'basePerHour' | 'fullPerHour' | 'gain' | 'fullProfitPerHour' | 'fullStock' | 'upgradesCost';

const COLUMNS: { key: Key; label: string }[] = [
  { key: 'name', label: 'Business' },
  { key: 'basePerHour', label: 'No upgrades /hr' },
  { key: 'fullPerHour', label: 'Fully upgraded /hr' },
  { key: 'gain', label: 'Upgrade gain /hr' },
  { key: 'fullProfitPerHour', label: 'Profit after supplies /hr' },
  { key: 'fullStock', label: 'Full stock (upgraded)' },
  { key: 'upgradesCost', label: 'Upgrades cost' },
];

const gainOf = (r: IncomeRow) => (r.basePerHour != null && r.fullPerHour != null ? r.fullPerHour - r.basePerHour : null);
const cash = (n: number | null, suffix = '') => (n == null ? '—' : `${money(n)}${suffix}`);

/** Sortable side-by-side income table for every business. */
export function IncomeCompare({ rows }: { rows: IncomeRow[] }) {
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: 'fullPerHour', dir: -1 });
  const sorted = useMemo(() => {
    const val = (r: IncomeRow) => (sort.key === 'gain' ? gainOf(r) : sort.key === 'name' ? r.name : r[sort.key]);
    return rows.slice().sort((a, b) => {
      const x = val(a);
      const y = val(b);
      if (x == null && y == null) return 0;
      if (x == null) return 1; // missing numbers always last
      if (y == null) return -1;
      return (typeof x === 'string' ? x.localeCompare(String(y)) : (x as number) - (y as number)) * sort.dir;
    });
  }, [rows, sort]);

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {COLUMNS.map((c) => (
              <th key={c.key} aria-sort={sort.key === c.key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
                <button
                  type="button"
                  onClick={() => setSort((s) => ({ key: c.key, dir: s.key === c.key ? (s.dir === 1 ? -1 : 1) : c.key === 'name' ? 1 : -1 }))}
                >
                  {c.label}
                  <ArrowUpDown size={13} aria-hidden="true" className={sort.key === c.key ? styles.on : undefined} />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.id}>
              <th scope="row">
                <Link href={r.href} className={styles.biz}>
                  <ItemMedia cat="businesses" image={r.image} alt="" variant="thumb" />
                  <span>
                    <strong>{r.name}</strong>
                    <span>{r.passive ? `${r.type} · ${r.passive}` : r.type}</span>
                  </span>
                </Link>
              </th>
              <td>{cash(r.basePerHour, '/hr')}</td>
              <td className={styles.money}>{cash(r.fullPerHour, '/hr')}</td>
              <td>{gainOf(r) != null ? `+${money(gainOf(r))}/hr` : '—'}</td>
              <td className={r.fullProfitPerHour != null && r.fullProfitPerHour < 0 ? styles.loss : undefined}>{cash(r.fullProfitPerHour, '/hr')}</td>
              <td>{cash(r.fullStock)}</td>
              <td>{cash(r.upgradesCost)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
