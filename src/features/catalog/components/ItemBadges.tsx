import { Zap } from 'lucide-react';
import type { BadgeData } from '../types';
import styles from './ItemBadges.module.css';

const ICONS = { electric: Zap };

/** Round icon badges shown over a card picture (e.g. ⚡ for electric vehicles). */
export function CardBadges({ badges }: { badges: BadgeData[] }) {
  if (!badges.length) return null;
  return (
    <span className={styles.overlay}>
      {badges.map((b) => {
        const Icon = ICONS[b.icon];
        return (
          <span key={b.label} className={`${styles.dot} ${styles[b.icon]}`} title={b.label} aria-label={b.label} role="img">
            <Icon size={14} strokeWidth={2.5} aria-hidden="true" />
          </span>
        );
      })}
    </span>
  );
}

/** Same badges as small labelled pills, for detail-page titles. */
export function BadgePills({ badges }: { badges: BadgeData[] }) {
  if (!badges.length) return null;
  return (
    <>
      {badges.map((b) => {
        const Icon = ICONS[b.icon];
        return (
          <span key={b.label} className={`${styles.pill} ${styles[b.icon]}`}>
            <Icon size={13} strokeWidth={2.5} aria-hidden="true" />
            {b.label}
          </span>
        );
      })}
    </>
  );
}
