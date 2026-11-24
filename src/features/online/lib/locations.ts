import raw from '@/data/business-locations.json';
import { isOnMap, worldToMap } from '@/features/map/lib/projection';
import type { MapPoint } from '@/features/map/types';

interface RawLocation {
  name: string;
  area: string | null;
  price: number | null;
  best: boolean;
  why: string | null;
  x: number | null;
  y: number | null;
}

/** One purchasable location of a business (serializable). */
export interface BusinessLocation {
  name: string;
  area: string | null;
  price: number | null;
  best: boolean;
  why: string | null;
  /** Pixel position on the 1600 px map, or null when coordinates are unknown. */
  point: MapPoint | null;
}

const DATA = raw as unknown as Record<string, { locations: RawLocation[]; note: string | null }>;

/** Locations for a business, cheapest first (best one first when prices tie), or null when we have none. */
export function getBusinessLocations(id: string): { locations: BusinessLocation[]; note: string | null } | null {
  const entry = DATA[id];
  if (!entry?.locations?.length) return null;
  const locations = entry.locations
    .map((l) => ({
      name: l.name,
      area: l.area,
      price: l.price,
      best: l.best,
      why: l.why,
      point: l.x != null && l.y != null && isOnMap(l.x, l.y) ? worldToMap(l.x, l.y) : null,
    }))
    .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity) || Number(b.best) - Number(a.best));
  return { locations, note: entry.note };
}
