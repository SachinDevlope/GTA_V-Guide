'use client';

import { useMemo } from 'react';
import type { MapImageInfo, MapMission } from '../types';
import { escapeHtml, GameMap, type MapPin } from './GameMap';
import styles from './MissionMap.module.css';

const PIN_COLORS: Record<string, string> = {
  Michael: 'var(--p-michael)',
  Franklin: 'var(--p-franklin)',
  Trevor: 'var(--p-trevor)',
};

interface Props {
  image: MapImageInfo;
  missions: MapMission[];
  focusId?: string | null;
  fit?: boolean;
}

/** Mission start points: one pin per place, listing every mission that starts there. */
export function MissionMap({ image, missions, focusId, fit }: Props) {
  const { pins, pinOf } = useMemo(() => {
    const groups = new Map<string, MapMission[]>();
    for (const m of missions) {
      if (!m.geo.point) continue;
      const k = m.geo.point.join(',');
      groups.set(k, [...(groups.get(k) ?? []), m]);
    }
    const pinOf = new Map<string, string>();
    const pins: MapPin[] = [...groups.entries()].map(([k, list]) => {
      const { point, area, place } = list[0].geo;
      const people = new Set(list.flatMap((m) => m.protagonists));
      const color = people.size === 1 ? PIN_COLORS[[...people][0]] ?? 'var(--p-multi)' : 'var(--p-multi)';
      const sorted = list.slice().sort((a, b) => (a.order ?? 1e9) - (b.order ?? 1e9));
      for (const m of list) pinOf.set(m.id, k);
      return {
        id: k,
        point: point!,
        label: list.length > 1 ? String(list.length) : '',
        color,
        dashed: area,
        title: sorted.map((m) => m.name).join(', '),
        popupHtml:
          `<div class="${styles.place}">${escapeHtml(place ?? '')}${area ? ' <span>(area)</span>' : ''}</div>` +
          sorted
            .map(
              (m) =>
                `<a class="${styles.row}" href="${m.href}" data-href="${m.href}"><b>${escapeHtml(m.name)}</b><span>${escapeHtml(
                  [m.type, m.protagonists.join(', ')].filter(Boolean).join(' · '),
                )}</span></a>`,
            )
            .join(''),
      };
    });
    return { pins, pinOf };
  }, [missions]);

  return <GameMap image={image} pins={pins} focusId={focusId ? pinOf.get(focusId) ?? null : null} fit={fit} />;
}
