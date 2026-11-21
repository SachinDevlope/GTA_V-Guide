import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MissionMapView } from '@/features/map/components/MissionMapView';
import { MAP_IMAGE } from '@/features/map/lib/geocode';
import { getMapMissions } from '@/features/map/lib/missions';

export const metadata: Metadata = {
  title: 'Mission Map',
  description: 'Where every GTA V story mission and Strangers and Freaks mission starts, on the map of San Andreas.',
};

export default function MapPage() {
  return (
    <Suspense>
      <MissionMapView image={MAP_IMAGE} missions={getMapMissions()} />
    </Suspense>
  );
}
