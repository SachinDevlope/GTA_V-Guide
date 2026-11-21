import raw from '@/data/collectible-locations.json';
import { isOnMap, worldToMap } from '@/features/map/lib/projection';
import type { MapPoint } from '@/features/map/types';

interface RawSet {
  source: string;
  rotating: boolean;
  points: { n: number; x: number; y: number; hint: string }[];
}

/** One collectible spot, ready for the map (serializable). */
export interface CollectibleSpot {
  n: number;
  hint: string;
  /** Pixel position on the 1600 px map, or null when off the map (e.g. Cayo Perico). */
  point: MapPoint | null;
}

export interface CollectibleLocations {
  source: string;
  rotating: boolean;
  spots: CollectibleSpot[];
}

const DATA = raw as unknown as Record<string, RawSet>;

/** Map spots for a collectible set, or null when we have no coordinates for it. */
export function getCollectibleLocations(id: string): CollectibleLocations | null {
  const set = DATA[id];
  if (!set?.points?.length) return null;
  return {
    source: set.source,
    rotating: set.rotating,
    spots: set.points.map((p) => ({ n: p.n, hint: p.hint, point: isOnMap(p.x, p.y) ? worldToMap(p.x, p.y) : null })),
  };
}

export function hasLocations(id: string): boolean {
  return Boolean(DATA[id]?.points?.length);
}
