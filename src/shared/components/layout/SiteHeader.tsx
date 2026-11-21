import Link from 'next/link';
import { HeaderSearch } from '@/features/search/components/HeaderSearch';
import { ThemeToggle } from '../ThemeToggle';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  return (
    <header className={styles.top}>
      <div className={`shell ${styles.row}`}>
        <Link className={styles.brand} href="/" aria-label="LS Index home">
          <span className={styles.mark}>LS</span>
          <span className={styles.text}>LS Index</span>
        </Link>
        <div className={styles.search}>
          <HeaderSearch />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
