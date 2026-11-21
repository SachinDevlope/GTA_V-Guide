'use client';

import 'leaflet/dist/leaflet.css';
import type { LayerGroup, Map as LeafletMap, Marker } from 'leaflet';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import type { MapImageInfo, MapPoint } from '../types';
import styles from './MissionMap.module.css';

/** One marker on the map. `popupHtml` may contain <a data-href="/path"> links. */
export interface MapPin {
  id: string;
  point: MapPoint;
  /** Text inside the pin (a count or a number). */
  label?: string;
  color: string;
  dashed?: boolean;
  title: string;
  popupHtml: string;
}

interface Props {
  image: MapImageInfo;
  pins: MapPin[];
  /** Pin id to zoom to and open. */
  focusId?: string | null;
  /** Zoom to fit all pins whenever they change. */
  fit?: boolean;
  /** CSS height of the map. */
  height?: string;
}

/**
 * Leaflet map of the state on the reference image. Shared by the mission map and the
 * collectible maps; callers decide the pins and their popups.
 */
export function GameMap({ image, pins, focusId, fit, height }: Props) {
  const router = useRouter();
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const LRef = useRef<typeof import('leaflet') | null>(null);
  const markers = useRef(new Map<string, Marker>());

  // Create the map once (Leaflet needs the browser, so it is loaded on the client only).
  useEffect(() => {
    let cancelled = false;
    import('leaflet').then((L) => {
      if (cancelled || !el.current || mapRef.current) return;
      LRef.current = L;
      const S = image.size;
      const map = L.map(el.current, { crs: L.CRS.Simple, minZoom: -1.5, maxZoom: 3, zoomSnap: 0.25, attributionControl: false });
      L.imageOverlay(image.src, [[-S, 0], [0, S]]).addTo(map);
      map.fitBounds([[-S * 0.92, S * 0.18], [-S * 0.08, S * 0.82]]);
      map.setMaxBounds([[-S * 1.1, -S * 0.1], [S * 0.1, S * 1.1]]);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      el.current.dispatchEvent(new Event('map-ready'));
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [image]);

  // Links inside popups navigate with the Next.js router.
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[data-href]') as HTMLAnchorElement | null;
      if (a) {
        e.preventDefault();
        router.push(a.dataset.href!);
      }
    };
    node.addEventListener('click', onClick);
    return () => node.removeEventListener('click', onClick);
  }, [router]);

  // Draw pins whenever they change.
  useEffect(() => {
    const node = el.current;
    const draw = () => {
      const L = LRef.current;
      const map = mapRef.current;
      const layer = layerRef.current;
      if (!L || !map || !layer) return;
      layer.clearLayers();
      markers.current.clear();
      for (const p of pins) {
        const icon = L.divIcon({
          className: styles.pinWrap,
          html: `<span class="${styles.pin} ${p.dashed ? styles.area : ''}" style="--pin:${p.color}">${p.label ?? ''}</span>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });
        const marker = L.marker([-p.point[1], p.point[0]], { icon, title: p.title, riseOnHover: true })
          .bindPopup(`<div class="${styles.popup}">${p.popupHtml}</div>`, { maxWidth: 300, maxHeight: 280 })
          .addTo(layer);
        markers.current.set(p.id, marker);
      }
      if (focusId && markers.current.has(focusId)) {
        const m = markers.current.get(focusId)!;
        map.setView(m.getLatLng(), 1.5);
        m.openPopup();
      } else if (fit && pins.length) {
        const pts = pins.map((p) => [-p.point[1], p.point[0]] as [number, number]);
        if (pts.length === 1) map.setView(pts[0], 1);
        else map.fitBounds(pts, { padding: [40, 40], maxZoom: 1 });
      }
    };
    draw();
    node?.addEventListener('map-ready', draw);
    return () => node?.removeEventListener('map-ready', draw);
  }, [pins, focusId, fit]);

  return <div ref={el} className={styles.map} style={height ? { height } : undefined} role="region" aria-label="Map" />;
}

/** Escapes text for use inside popup HTML. */
export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
