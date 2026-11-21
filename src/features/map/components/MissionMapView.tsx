'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FilterBar } from '@/features/catalog/components/FilterBar';
import { prepare, searchPrepared } from '@/features/search/lib/engine';
import type { MapImageInfo, MapMission } from '../types';
import { MissionMap } from './MissionMap';
import styles from './MissionMap.module.css';

const LEGEND = [
  ['Michael', 'var(--p-michael)'],
  ['Franklin', 'var(--p-franklin)'],
  ['Trevor', 'var(--p-trevor)'],
  ['Several', 'var(--p-multi)'],
] as const;

/** Map page: filters + search narrow which mission pins are shown. */
export function MissionMapView({ image, missions }: { image: MapImageInfo; missions: MapMission[] }) {
  const focusId = useSearchParams().get('focus');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [q, setQ] = useState('');

  const searchable = useMemo(
    () =>
      prepare(
        missions.map((m) => ({
          ...m,
          description: null,
          search: [
            { text: m.geo.place ?? '', weight: 5 },
            { text: m.type, weight: 2 },
            { text: m.protagonists.join(' '), weight: 3 },
          ],
        })),
      ),
    [missions],
  );

  const shown = useMemo(() => {
    let list = missions;
    if (filters.type) list = list.filter((m) => m.type === filters.type);
    if (filters.protagonists) list = list.filter((m) => m.protagonists.includes(filters.protagonists));
    if (q.trim()) {
      const ids = new Set(searchPrepared(searchable, q).map((h) => h.item.id));
      list = list.filter((m) => ids.has(m.id));
    }
    return list;
  }, [missions, filters, q, searchable]);

  const types = [...new Set(missions.map((m) => m.type))].sort();
  const people = [...new Set(missions.flatMap((m) => m.protagonists))].sort();
  const pinned = shown.filter((m) => m.geo.point).length;
  const offMap = shown.filter((m) => m.geo.offMap).length;

  return (
    <>
      <div className={styles.head}>
        <div>
          <h1>Mission map</h1>
          <p>Where every story mission starts. Click a pin to see the missions there.</p>
        </div>
        <input
          className={styles.quick}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Find a mission or place…"
          aria-label="Find a mission or place on the map"
        />
      </div>
      <FilterBar
        filters={[
          { def: { key: 'type', label: 'Type' }, options: types.map((t) => ({ value: t, label: t, count: missions.filter((m) => m.type === t).length })) },
          {
            def: { key: 'protagonists', label: 'Character' },
            options: people.map((p) => ({ value: p, label: p, count: missions.filter((m) => m.protagonists.includes(p)).length })),
          },
        ]}
        selected={filters}
        onFilter={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
        onReset={() => setFilters({})}
      />
      <p className={styles.status} aria-live="polite">
        {pinned} missions on the map{q.trim() && ` for “${q.trim()}”`}
        {offMap > 0 && ` · ${offMap} in North Yankton (off the map)`}
      </p>
      <MissionMap image={image} missions={shown} focusId={focusId} fit={Boolean(q.trim() || filters.type || filters.protagonists)} />
      <div className={styles.legend}>
        {LEGEND.map(([label, color]) => (
          <span key={label}>
            <i style={{ background: color }} />
            {label}
          </span>
        ))}
        <span className={styles.note}>
          Pins are approximate start points; dashed pins mark a whole district. Number = missions at that spot.
        </span>
      </div>
    </>
  );
}
