import images from '@/data/images.json';
import type { ImageRef } from '@/shared/types';
import type { BaseItem, CategoryDefinition } from '../types';

const IMAGE_MAP = images as Record<string, ImageRef>;

/** Picture for an item: its own `image` field wins, then the generated map (scripts/fetch-images.mjs). */
export function imageFor(def: CategoryDefinition<BaseItem>, item: BaseItem): ImageRef | null {
  if (item.image) return { src: item.image, page: null };
  return IMAGE_MAP[`${def.key}/${item.id}`] ?? null;
}
