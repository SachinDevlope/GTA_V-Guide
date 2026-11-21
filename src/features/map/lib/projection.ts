import type { MapPoint } from '../types';

/**
 * Converts GTA V world coordinates (x east, y north) to pixels on the 1600 px reference map
 * (public/map/san-andreas.webp scaled to 1600). Fitted from landmarks with known in-game
 * coordinates (Michael's, Franklin's and Trevor's houses, Maze Bank Tower, Mount Chiliad,
 * Sandy Shores airfield, Paleto Bay bank, Fort Zancudo…). Accurate to roughly ±25 px.
 */
const SCALE_X = 0.127138;
const OFFSET_X = 724.56;
const SCALE_Y = -0.125182;
const OFFSET_Y = 1079.4;

export function worldToMap(x: number, y: number): MapPoint {
  return [SCALE_X * x + OFFSET_X, SCALE_Y * y + OFFSET_Y];
}

/** True when a world point falls on the mapped state (Cayo Perico is off this map). */
export function isOnMap(x: number, y: number): boolean {
  const [px, py] = worldToMap(x, y);
  return px >= 0 && px <= 1600 && py >= 0 && py <= 1600;
}
