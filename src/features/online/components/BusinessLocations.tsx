'use client';

import { MapPin, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { escapeHtml, GameMap, type MapPin as Pin } from '@/features/map/components/GameMap';
import type { MapImageInfo } from '@/features/map/types';
import { money } from '@/shared/lib/format';
import type { BusinessLocation } from '../lib/locations';
import styles from './BusinessLocations.module.css';

interface Props {
  name: string;
  locations: BusinessLocation[];
  note: string | null;
  image: MapImageInfo;
}

/** Every location of a business with its price; the community's best pick is highlighted (and pinned when coordinates exist). */
export function BusinessLocations({ name, locations, note, image }: Props) {
  const [focus, setFocus] = useState<string | null>(null);
  const pins = useMemo<Pin[]>(
    () =>
      locations
        .filter((l) => l.point)
        .map((l) => ({
          id: l.name,
          point: l.point!,
          label: l.best ? '★' : '',
          color: l.best ? 'var(--accent)' : 'var(--muted)',
          title: l.name,
          popupHtml: `<div style="font-weight:700;font-size:14px">${escapeHtml(l.name)}</div><div style="font-size:13px;color:var(--muted)">${escapeHtml(
            [l.area, money(l.price)].filter(Boolean).join(' · '),
          )}</div>${l.best && l.why ? `<div style="font-size:13px;margin-top:4px">${escapeHtml(l.why)}</div>` : ''}`,
        })),
    [locations],
  );

  return (
    <div className={styles.wrap}>
      <ul className={styles.list} aria-label={`${name} locations`}>
        {locations.map((l) => (
          <li key={l.name} className={l.best ? styles.best : undefined}>
            <button type="button" className={styles.row} onClick={() => setFocus(l.name)} disabled={!l.point} title={l.point ? 'Show on map' : undefined}>
              <span className={styles.text}>
                <span className={styles.name}>
                  {l.name}
                  {l.best && (
                    <span className={styles.badge}>
                      <Star size={12} fill="currentColor" strokeWidth={0} aria-hidden="true" /> Best
                    </span>
                  )}
                </span>
                {l.area && <span className={styles.area}>{l.area}</span>}
                {l.best && l.why && <span className={styles.why}>{l.why}</span>}
              </span>
              <span className={styles.price}>
                {money(l.price) ?? '—'}
                {l.point && <MapPin size={15} aria-hidden="true" className={styles.pin} />}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {pins.length > 0 && <GameMap image={image} pins={pins} focusId={focus} fit={!focus} height="min(60vh, 520px)" />}
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
