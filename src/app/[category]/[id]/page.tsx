import type { Metadata } from 'next';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ItemDetail } from '@/features/catalog/components/ItemDetail';
import { findItem } from '@/features/catalog/lib/cards';
import { CATEGORIES, CATEGORY_KEYS, getCategory, isCategoryKey } from '@/features/catalog/registry';
import { CollectibleMap } from '@/features/collectibles/components/CollectibleMap';
import { getCollectibleLocations } from '@/features/collectibles/lib/locations';
import { DetailSection } from '@/features/catalog/components/detail/DetailSection';
import { MAP_IMAGE } from '@/features/map/lib/geocode';
import { getMapMission } from '@/features/map/lib/missions';
import styles from './page.module.css';

interface Params {
  params: Promise<{ category: string; id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_KEYS.flatMap((category) => CATEGORIES[category].items.map((it) => ({ category, id: it.id })));
}

async function load(params: Params['params']) {
  const { category, id } = await params;
  if (!isCategoryKey(category)) return null;
  const item = findItem(category, decodeURIComponent(id));
  return item ? { def: getCategory(category), item } : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const found = await load(params);
  if (!found) return {};
  return { title: found.item.name, description: found.item.description ?? found.def.subtitle(found.item) };
}

export default async function ItemPage({ params }: Params) {
  const found = await load(params);
  if (!found) notFound();
  const { def, item } = found;

  // Missions with a known start point link to the map.
  const mapMission = def.key === 'missions' ? getMapMission(item.id) : undefined;
  const actions = mapMission?.geo.point ? (
    <p>
      <Link className={styles.mapBtn} href={`/map?focus=${encodeURIComponent(item.id)}`}>
        <MapPin size={16} aria-hidden="true" /> Show on map · {mapMission.geo.place}
      </Link>
    </p>
  ) : null;

  // Collectible sets with known coordinates get a map of every spot.
  const locations = def.key === 'collectibles' ? getCollectibleLocations(item.id) : null;
  const extra = locations ? (
    <DetailSection title={`All ${locations.spots.length} locations`}>
      <CollectibleMap setId={item.id} name={item.name} image={MAP_IMAGE} data={locations} />
    </DetailSection>
  ) : null;

  return <ItemDetail def={def} item={item} actions={actions} extra={extra} />;
}
