import type { Metadata } from 'next';
import { TrendingUp } from 'lucide-react';
import { IncomeCompare } from '@/features/online/components/IncomeCompare';
import { getIncomeRows } from '@/features/online/lib/income';
import styles from '../best/page.module.css';

export const metadata: Metadata = {
  title: 'Business income',
  description: 'How much every GTA Online business earns with no upgrades, with each upgrade, and fully upgraded.',
};

export default function IncomePage() {
  const rows = getIncomeRows();
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <span className={styles.icon}>
          <TrendingUp size={22} aria-hidden="true" />
        </span>
        <div>
          <h1>Business income</h1>
          <p>
            What each GTA Online business earns with no upgrades and fully upgraded, and how much the upgrades add. Click a business for
            every upgrade level. All figures are per real-world hour.
          </p>
        </div>
      </header>
      <section className={styles.section}>
        {rows.length ? <IncomeCompare rows={rows} /> : <p className={styles.lead}>Income data is being added.</p>}
      </section>
    </div>
  );
}
