import { BadgePercent, Info, LockOpen } from 'lucide-react';
import { money } from '@/shared/lib/format';
import type { TradePrice } from '../types';
import styles from './TradePriceCard.module.css';

/** Trade price next to the normal price, the saving, and how to unlock it. */
export function TradePriceCard({ price, trade }: { price: number | null; trade: TradePrice }) {
  const save = price != null ? price - trade.price : null;
  return (
    <div className={styles.card}>
      <div className={styles.prices}>
        <div>
          <span>Normal price</span>
          <strong className={styles.normal}>{money(price) ?? '—'}</strong>
        </div>
        <div>
          <span>
            <BadgePercent size={14} aria-hidden="true" /> Trade price
          </span>
          <strong className={styles.trade}>{money(trade.price)}</strong>
        </div>
        {save != null && save > 0 && (
          <div>
            <span>You save</span>
            <strong className={styles.save}>
              {money(save)} <small>({Math.round((save / price!) * 100)}%)</small>
            </strong>
          </div>
        )}
      </div>
      <div className={styles.unlock}>
        <LockOpen size={16} aria-hidden="true" />
        <span>
          <strong>How to unlock{trade.unlockType ? ` · ${trade.unlockType}` : ''}</strong>
          <span>{trade.unlock}</span>
        </span>
      </div>
      {trade.note && (
        <div className={styles.note}>
          <Info size={14} aria-hidden="true" />
          <p>{trade.note}</p>
        </div>
      )}
    </div>
  );
}
