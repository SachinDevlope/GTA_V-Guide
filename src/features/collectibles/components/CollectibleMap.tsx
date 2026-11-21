'use client';

import { Check, MapPin as MapPinIcon, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { escapeHtml, GameMap, type MapPin } from '@/features/map/components/GameMap';
import type { MapImageInfo } from '@/features/map/types';
import type { CollectibleLocations } from '../lib/locations';
import styles from './CollectibleMap.module.css';

const storageKey = (setId: string) => `lsindex-found-${setId}`;

/** "West Vinewood, about 154 m above sea level" → { place: "West Vinewood", detail: "154 m above sea level" } */
function splitHint(hint: string): { place: string; detail: string } {
  const i = hint.indexOf(', ');
  if (i < 0) return { place: hint, detail: '' };
  return { place: hint.slice(0, i), detail: hint.slice(i + 2).replace(/^about /, '') };
}

/** Numbered pins + numbered list; spots can be ticked off as found (saved in this browser). */
export function CollectibleMap({ setId, name, image, data }: { setId: string; name: string; image: MapImageInfo; data: CollectibleLocations }) {
  const [focus, setFocus] = useState<string | null>(null);
  const [found, setFound] = useState<Set<number>>(new Set());
  const [hideFound, setHideFound] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => {
    try {
      setFound(new Set(JSON.parse(localStorage.getItem(storageKey(setId)) || '[]')));
    } catch {
      /* storage blocked */
    }
  }, [setId]);

  const toggle = (n: number) => {
    setFound((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      try {
        localStorage.setItem(storageKey(setId), JSON.stringify([...next]));
      } catch {
        /* storage blocked */
      }
      return next;
    });
  };

  const query = q.trim().toLowerCase();
  const visible = data.spots.filter(
    (s) => !(hideFound && found.has(s.n)) && (!query || s.hint.toLowerCase().includes(query) || String(s.n) === query),
  );
  const pins = useMemo<MapPin[]>(
    () =>
      visible
        .filter((s) => s.point)
        .map((s) => ({
          id: String(s.n),
          point: s.point!,
          label: String(s.n),
          color: found.has(s.n) ? 'var(--muted)' : 'var(--accent)',
          title: `${name} #${s.n}`,
          popupHtml: `<div class="${styles.popTitle}">${escapeHtml(name)} #${s.n}</div><div class="${styles.popHint}">${escapeHtml(s.hint)}</div>`,
        })),
    [visible, found, name],
  );
  const offMap = data.spots.filter((s) => !s.point);

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <span className={styles.progress}>
          <strong>{found.size}</strong> / {data.spots.length} found
        </span>
        <label className={styles.toggle}>
          <input type="checkbox" checked={hideFound} onChange={(e) => setHideFound(e.target.checked)} /> Hide found
        </label>
        {data.rotating && <span className={styles.rot}>Only some of these spots are active each day.</span>}
      </div>
      <div className={styles.layout}>
        <GameMap image={image} pins={pins} focusId={focus} fit={!focus} height="min(70vh, 640px)" />
        <div className={styles.panel}>
          <label className={styles.search}>
            <Search size={15} aria-hidden="true" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by area or number" aria-label="Filter locations" />
          </label>
          <ol className={styles.list}>
            {visible.map((s) => {
              const { place, detail } = splitHint(s.hint);
              const isFound = found.has(s.n);
              return (
                <li
                  key={s.n}
                  className={`${styles.row} ${isFound ? styles.done : ''} ${focus === String(s.n) ? styles.selected : ''}`}
                >
                  <button
                    type="button"
                    className={styles.check}
                    aria-pressed={isFound}
                    aria-label={`Mark #${s.n} as ${isFound ? 'not found' : 'found'}`}
                    onClick={() => toggle(s.n)}
                  >
                    {isFound && <Check size={13} strokeWidth={3} aria-hidden="true" />}
                  </button>
                  <button type="button" className={styles.item} onClick={() => setFocus(String(s.n))} disabled={!s.point}>
                    <span className={styles.num}>{s.n}</span>
                    <span className={styles.text}>
                      <span className={styles.place}>{place}</span>
                      {detail && <span className={styles.detail}>{detail}</span>}
                    </span>
                    {s.point ? <MapPinIcon size={15} aria-hidden="true" className={styles.pinIcon} /> : <span className={styles.off}>off map</span>}
                  </button>
                </li>
              );
            })}
            {!visible.length && <li className={styles.empty}>No spots match.</li>}
          </ol>
        </div>
      </div>
      {offMap.length > 0 && <p className={styles.note}>{offMap.length} spots are outside this map (e.g. on Cayo Perico) and are listed without a pin.</p>}
      <p className={styles.note}>Pins are placed from in-game coordinates and may be off by a short distance.</p>
    </div>
  );
}
