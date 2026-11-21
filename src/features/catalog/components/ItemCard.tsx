import Link from 'next/link';
import { Stars } from '@/features/ratings/Stars';
import { highlight } from '@/features/search/lib/highlight';
import type { CardModel } from '../types';
import { CardBadges } from './ItemBadges';
import { ItemMedia } from './ItemMedia';
import styles from './ItemCard.module.css';

interface Props {
  card: CardModel;
  /** Category name shown above the title (for mixed result lists). */
  label?: string;
  query?: string;
}

/** Picture card used in grids. */
export function ItemCard({ card, label, query }: Props) {
  const price = card.chips.find((c) => c.tone === 'money');
  const meta = card.chips.filter((c) => c !== price).map((c) => c.label);
  return (
    <Link href={card.href} className={styles.card}>
      <span className={styles.mediaWrap}>
        <ItemMedia cat={card.cat} image={card.image} alt={card.name} variant="card" />
        <CardBadges badges={card.badges} />
      </span>
      <div className={styles.body}>
        {label && <span className={styles.label}>{label}</span>}
        <h3 className={styles.title}>{highlight(card.name, query)}</h3>
        {card.subtitle && <p className={styles.sub}>{highlight(card.subtitle, query)}</p>}
        {card.rating && (
          <p className={styles.rating} title={card.rating.basis}>
            <Stars value={card.rating.stars} size={13} />
          </p>
        )}
        {(price || meta.length > 0) && (
          <p className={styles.meta}>
            {price && <span className={styles.price}>{price.label}</span>}
            {meta.length > 0 && <span>{meta.join(' · ')}</span>}
          </p>
        )}
      </div>
    </Link>
  );
}
