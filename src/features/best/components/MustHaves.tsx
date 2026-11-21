import Link from 'next/link';
import { ItemMedia } from '@/features/catalog/components/ItemMedia';
import { Stars } from '@/features/ratings/Stars';
import type { MustHave } from '../lib/mustHaves';
import styles from './MustHaves.module.css';

const priceOf = (m: MustHave) => m.card.chips.find((c) => c.tone === 'money')?.label;

/** Step-by-step buying order: numbered rows with picture, reason and price. */
export function BuyingOrder({ items }: { items: MustHave[] }) {
  return (
    <ol className={styles.order}>
      {items.map((m, i) => (
        <li key={m.card.key}>
          <Link href={m.card.href} className={styles.step}>
            <span className={styles.num}>{i + 1}</span>
            <ItemMedia cat={m.card.cat} image={m.card.image} alt="" variant="thumb" />
            <span className={styles.text}>
              <span className={styles.name}>{m.card.name}</span>
              <span className={styles.why}>{m.why}</span>
            </span>
            {priceOf(m) && <span className={styles.price}>{priceOf(m)}</span>}
          </Link>
        </li>
      ))}
    </ol>
  );
}

/** One group of must-haves (e.g. Vehicles) as picture cards with a role and reason. */
export function MustHaveGroup({ title, items }: { title: string; items: MustHave[] }) {
  return (
    <section className={styles.group}>
      <h3>{title}</h3>
      <div className={styles.cards}>
        {items.map((m) => (
          <Link key={m.card.key} href={m.card.href} className={styles.card}>
            <ItemMedia cat={m.card.cat} image={m.card.image} alt={m.card.name} variant="card" />
            <span className={styles.body}>
              {m.role && <span className={styles.role}>{m.role}</span>}
              <span className={styles.name}>{m.card.name}</span>
              <span className={styles.why}>{m.why}</span>
              <span className={styles.meta}>
                {m.card.rating && <Stars value={m.card.rating.stars} size={12} />}
                {priceOf(m) && <span className={styles.price}>{priceOf(m)}</span>}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
