import { Star, StarHalf } from 'lucide-react';
import styles from './Stars.module.css';

/** 1–5 stars in half steps. */
export function Stars({ value, size = 14, showValue = false }: { value: number; size?: number; showValue?: boolean }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className={styles.stars} role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <Star key={i} size={size} className={styles.on} fill="currentColor" strokeWidth={0} />;
        if (i === full && half) {
          return (
            <span key={i} className={styles.halfWrap} style={{ width: size, height: size }}>
              <Star size={size} className={styles.off} fill="currentColor" strokeWidth={0} />
              <StarHalf size={size} className={`${styles.on} ${styles.half}`} fill="currentColor" strokeWidth={0} />
            </span>
          );
        }
        return <Star key={i} size={size} className={styles.off} fill="currentColor" strokeWidth={0} />;
      })}
      {showValue && <span className={styles.value}>{value.toFixed(1)}</span>}
    </span>
  );
}
