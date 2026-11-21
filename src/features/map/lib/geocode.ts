import placesData from '@/data/places.json';
import { titleCase } from '@/shared/lib/format';
import type { GeoResult, MapImageInfo, MapPoint } from '../types';

type PlaceValue = MapPoint | { at: MapPoint; area: true };

const DATA = placesData as unknown as { mapImage: MapImageInfo; offMap: string[]; places: Record<string, PlaceValue> };

export const MAP_IMAGE: MapImageInfo = DATA.mapImage;

const clean = (s: string) => ' ' + s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']+/g, ' ').trim() + ' ';

// Longest names first so "Sandy Shores Airfield" wins over "Sandy Shores".
const PLACE_KEYS = Object.keys(DATA.places).sort((a, b) => b.length - a.length);

/**
 * Converts free-text location ("Forum Drive, Strawberry, Los Santos") into a map point.
 * When a location lists several places ("A / B"), the first one is where the mission starts.
 */
export function geocode(location: string | null | undefined): GeoResult {
  const text = location ?? '';
  const start = text.split('/')[0];
  if (DATA.offMap.some((p) => clean(start).includes(` ${p} `))) {
    return { point: null, area: false, place: null, offMap: true };
  }
  for (const segment of [start, text]) {
    const n = clean(segment);
    for (const key of PLACE_KEYS) {
      if (n.includes(clean(key))) {
        const v = DATA.places[key];
        const isArea = !Array.isArray(v);
        return { point: isArea ? v.at : v, area: isArea, place: titleCase(key), offMap: false };
      }
    }
  }
  return { point: null, area: false, place: null, offMap: false };
}
