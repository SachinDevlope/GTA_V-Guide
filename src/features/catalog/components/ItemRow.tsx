import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Stars } from '@/features/ratings/Stars';
import { highlight } from '@/features/search/lib/highlight';
import type { CardModel } from '../types';
import { BadgePills } from './ItemBadges';
import { ItemMedia } from './ItemMedia';
import styles from './ItemRow.module.css';

interface Props {
  card: CardModel;
  label?: string;
  query?: string;
  /** Leading number, e.g. story order. */
  index?: number | null;
}

/** Compact row used for list-style categories (missions, cheats, skills). */
export function ItemRow({ card, label, query, index }: Props) {
  const price = card.chips.find((c) => c.tone === 'money');
  const meta = card.chips.filter((c) => c !== price && !/^#\d+$/.test(c.label)).map((c) => c.label);
  return (
    <Link href={card.href} className={styles.row}>
      {index != null && <span className={styles.index}>{index}</span>}
      <ItemMedia cat={card.cat} image={card.image} alt="" variant="thumb" />
      <span className={styles.main}>
        <span className={styles.title}>
          {label && <span className={styles.label}>{label}</span>}
          {highlight(card.name, query)} <BadgePills badges={card.badges} />
        </span>
        <span className={styles.sub}>{highlight(card.subtitle, query)}</span>
      </span>
      {card.rating && (
        <span className={styles.stars} title={card.rating.basis}>
          <Stars value={card.rating.stars} size={13} />
        </span>
      )}
      <span className={styles.meta}>{price?.label ?? meta.join(' · ')}</span>
      <ChevronRight className={styles.chev} size={18} aria-hidden="true" />
    </Link>
  );
}
