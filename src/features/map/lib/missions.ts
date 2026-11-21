import { itemHref } from '@/features/catalog/lib/cards';
import { missionsCategory } from '@/features/missions/category';
import type { MapMission } from '../types';
import { geocode } from './geocode';

let cache: MapMission[] | null = null;

/** Every story mission with its map position. Runs on the server. */
export function getMapMissions(): MapMission[] {
  cache ??= missionsCategory.items.map((m) => ({
    id: m.id,
    href: itemHref('missions', m.id),
    name: m.name,
    type: m.type,
    order: m.order,
    protagonists: m.protagonists ?? [],
    geo: geocode(m.location),
  }));
  return cache;
}

export function getMapMission(id: string): MapMission | undefined {
  return getMapMissions().find((m) => m.id === id);
}
