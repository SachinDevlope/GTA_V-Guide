/** [x, y] in pixels on the reference map image (see src/data/places.json). */
export type MapPoint = [number, number];

export interface MapImageInfo {
  src: string;
  page: string;
  size: number;
}

export interface GeoResult {
  point: MapPoint | null;
  /** True when the pin marks a whole district rather than one building. */
  area: boolean;
  place: string | null;
  /** True when the location is outside the mapped state (e.g. North Yankton). */
  offMap: boolean;
}

/** Mission summary for the map (serializable). */
export interface MapMission {
  id: string;
  href: string;
  name: string;
  type: string;
  order: number | null;
  protagonists: string[];
  geo: GeoResult;
}
