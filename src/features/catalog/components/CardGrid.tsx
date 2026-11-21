import type { CardModel, CategoryMeta } from '../types';
import { ItemCard } from './ItemCard';
import { ItemRow } from './ItemRow';
import styles from './ItemCard.module.css';

interface Props {
  cards: CardModel[];
  categories: CategoryMeta[];
  layout?: 'grid' | 'list';
  /** Show which category each item belongs to. */
  showLabels?: boolean;
  query?: string;
  limit?: number;
  /** Number list rows by this sort value (e.g. "order"). */
  numberBy?: string;
}

/** Renders cards as a picture grid or a compact list. */
export function CardGrid({ cards, categories, layout = 'grid', showLabels, query, limit = 300, numberBy }: Props) {
  const meta = new Map(categories.map((c) => [c.key, c]));
  const shown = cards.slice(0, limit);
  if (layout === 'list') {
    return (
      <div className={styles.list}>
        {shown.map((card) => (
          <ItemRow
            key={card.key}
            card={card}
            label={showLabels ? meta.get(card.cat)?.short : undefined}
            query={query}
            index={numberBy ? (card.sortValues[numberBy] as number | null) : undefined}
          />
        ))}
      </div>
    );
  }
  return (
    <div className={styles.grid}>
      {shown.map((card) => (
        <ItemCard key={card.key} card={card} label={showLabels ? meta.get(card.cat)?.short : undefined} query={query} />
      ))}
    </div>
  );
}
