import type { MetadataRoute } from 'next';
import { CATEGORIES, CATEGORY_KEYS } from '@/features/catalog/registry';

const SITE = 'https://gtavguide.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const fixed = ['', '/best', '/income', '/map'].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    priority: path === '' ? 1 : 0.8,
  }));
  const categories = CATEGORY_KEYS.map((category) => ({
    url: `${SITE}/${category}`,
    lastModified: now,
    priority: 0.7,
  }));
  const items = CATEGORY_KEYS.flatMap((category) =>
    CATEGORIES[category].items.map((it) => ({
      url: `${SITE}/${category}/${encodeURIComponent(it.id)}`,
      lastModified: now,
      priority: 0.5,
    })),
  );
  return [...fixed, ...categories, ...items];
}
