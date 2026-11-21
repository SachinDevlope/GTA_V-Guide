import Link from 'next/link';
import { ItemMedia } from '@/features/catalog/components/ItemMedia';
import { Stars } from '@/features/ratings/Stars';
import type { Board } from '../lib/leaderboards';
import styles from './Leaderboard.module.css';

/** A ranked list (1, 2, 3…) of items with picture, stars and the key number. */
export function Leaderboard({ board, compact = false }: { board: Board; compact?: boolean }) {
  return (
    <section className={`${styles.board} ${compact ? styles.compact : ''}`}>
      <header>
        <h3>{board.title}</h3>
        <p>{board.note}</p>
      </header>
      <ol>
        {board.cards.map((c, i) => {
          const money = c.chips.find((x) => x.tone === 'money')?.label;
          const extra = c.chips.filter((x) => x.tone !== 'money').map((x) => x.label)[0];
          return (
            <li key={c.key}>
              <Link href={c.href} className={styles.row}>
                <span className={`${styles.rank} ${i < 3 ? styles[`r${i + 1}`] : ''}`}>{i + 1}</span>
                <ItemMedia cat={c.cat} image={c.image} alt="" variant="thumb" />
                <span className={styles.main}>
                  <span className={styles.name}>{c.name}</span>
                  <span className={styles.sub}>{[extra, money].filter(Boolean).join(' · ') || c.subtitle}</span>
                </span>
                {c.rating && <Stars value={c.rating.stars} size={13} />}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
