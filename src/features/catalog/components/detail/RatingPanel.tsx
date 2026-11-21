import { Stars } from '@/features/ratings/Stars';
import type { Rating } from '@/features/ratings/types';
import styles from './RatingPanel.module.css';

/** Big star rating with what it's based on. */
export function RatingPanel({ rating }: { rating: Rating }) {
  return (
    <div className={styles.rating}>
      <div className={styles.ratingTop}>
        <span className={styles.ratingValue}>{rating.stars.toFixed(1)}</span>
        <Stars value={rating.stars} size={20} />
      </div>
      {rating.rank && (
        <p className={styles.rank}>
          #{rating.rank.position} of {rating.rank.total} {rating.rank.label}
        </p>
      )}
      <p>{rating.basis}</p>
    </div>
  );
}
