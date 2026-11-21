import type { Metadata } from 'next';
import { Trophy } from 'lucide-react';
import { Leaderboard } from '@/features/best/components/Leaderboard';
import { businessBoard, heistBoard, vehicleBoards, weaponBoards } from '@/features/best/lib/leaderboards';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Best of',
  description: 'The best GTA Online businesses, the best weapons per type and the fastest vehicles per class, rated from the data.',
};

export default function BestPage() {
  const businesses = businessBoard();
  const heists = heistBoard();
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <span className={styles.icon}>
          <Trophy size={22} aria-hidden="true" />
        </span>
        <div>
          <h1>Best of</h1>
          <p>Star ratings come from the numbers: lap times and top speeds within each vehicle class, weapon stats within each weapon type, and money-making tiers for businesses and heists.</p>
        </div>
      </header>

      <section className={styles.section}>
        <h2>Businesses</h2>
        <Leaderboard board={businesses} />
      </section>

      {heists.cards.length > 0 && (
        <section className={styles.section}>
          <h2>Heists</h2>
          <Leaderboard board={heists} />
        </section>
      )}

      <section className={styles.section}>
        <h2>Weapons</h2>
        <div className={styles.grid}>
          {weaponBoards().map((b) => (
            <Leaderboard key={b.title} board={b} compact />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Vehicles</h2>
        <div className={styles.grid}>
          {vehicleBoards().map((b) => (
            <Leaderboard key={b.title} board={b} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
