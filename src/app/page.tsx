import { ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { CardGrid } from '@/features/catalog/components/CardGrid';
import { CategoryTiles } from '@/features/catalog/components/CategoryTiles';
import { findByName, getCards } from '@/features/catalog/lib/cards';
import { sortCards } from '@/features/catalog/lib/filtering';
import { CATEGORY_META } from '@/features/catalog/registry';
import type { CardModel } from '@/features/catalog/types';
import { SearchBar } from '@/features/search/components/SearchBar';
import { EXAMPLE_QUERIES, POPULAR_SEARCHES } from '@/features/search/popular';
import styles from './page.module.css';

export default function HomePage() {
  const missions = sortCards(
    getCards('missions').filter((c) => !c.facets.type?.includes('Strangers and Freaks')),
    { label: 'order', key: 'order', dir: 'asc' },
  );
  const popular = POPULAR_SEARCHES.map((n) => findByName(n)).filter((c): c is CardModel => Boolean(c?.image)).slice(0, 8);

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>GTA V · GTA Online</span>
        <h1>Look up anything in Los Santos.</h1>
        <p>Missions, heists, vehicles, weapons, cheats and more — one search, typos welcome.</p>
        <div className={styles.searchBox}>
          <Suspense>
            <SearchBar size="hero" />
          </Suspense>
        </div>
        <div className={styles.try}>
          <span>Try</span>
          {EXAMPLE_QUERIES.slice(0, 7).map((q) => (
            <Link key={q} href={`/search?q=${encodeURIComponent(q)}`}>
              {q}
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Popular right now</h2>
        </div>
        <CardGrid cards={popular} categories={CATEGORY_META} showLabels />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Browse by category</h2>
        </div>
        <CategoryTiles />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Story missions</h2>
          <Link href="/missions">
            All {missions.length} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <Link href="/map" className={styles.mapPromo}>
          <MapPin size={20} aria-hidden="true" />
          <span>
            <strong>Mission map</strong>
            <span>See where every mission starts on the map of San Andreas.</span>
          </span>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <CardGrid cards={missions} categories={CATEGORY_META} layout="list" limit={10} numberBy="order" />
      </section>
    </div>
  );
}
