import type { Rating } from '@/features/ratings/types';
import type { ImageRef } from '@/shared/types';
import type { CategoryKey, Fact, StatBar } from '../../types';
import { ItemMedia } from '../ItemMedia';
import { StatBars } from '../StatBars';
import { KeyFactTiles } from './KeyFactTiles';
import { RatingPanel } from './RatingPanel';
import styles from './detail.module.css';

interface Props {
  cat: CategoryKey;
  name: string;
  image: ImageRef | null;
  keyFacts: Fact[];
  stats: StatBar[];
  rating: Rating | null;
}

/**
 * Picture on the left at a fixed 16:10 shape, key facts and stat bars on the right.
 * Used by every detail page, so layout fixes here apply to all categories.
 */
export function DetailHero({ cat, name, image, keyFacts, stats, rating }: Props) {
  const hasSide = keyFacts.length > 0 || stats.length > 0 || rating !== null;
  return (
    <div className={hasSide ? styles.hero : styles.heroSolo}>
      <div className={styles.picture}>
        <ItemMedia cat={cat} image={image} alt={name} variant="hero" />
      </div>
      {hasSide && (
        <div className={styles.side}>
          {rating && <RatingPanel rating={rating} />}
          <KeyFactTiles facts={keyFacts} />
          {stats.length > 0 && <StatBars stats={stats} />}
        </div>
      )}
    </div>
  );
}
