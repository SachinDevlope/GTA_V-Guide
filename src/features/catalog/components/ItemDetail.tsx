import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { CheatCodes } from '@/features/cheats/components/CheatCodes';
import { RememberVisit } from '@/features/search/components/RememberVisit';
import { hasValue } from '@/shared/lib/format';
import { imageFor } from '../lib/images';
import type { BaseItem, CategoryDefinition } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { BadgePills } from './ItemBadges';
import { DetailHero } from './detail/DetailHero';
import { DetailSection } from './detail/DetailSection';
import { FactsTable } from './detail/FactsTable';
import { Linked } from './detail/Linked';
import { ProsCons } from './detail/ProsCons';
import { Recommendations } from './detail/Recommendations';
import styles from './ItemDetail.module.css';

interface Props {
  def: CategoryDefinition<BaseItem>;
  item: BaseItem;
  /** Extra content from other features (e.g. "Show on map"). */
  actions?: ReactNode;
  /** Extra sections from other features (e.g. upgrades, rankings), shown after About. */
  extra?: ReactNode;
}

/** Full page view of one item, shared by every category. Server component. */
export function ItemDetail({ def, item, actions, extra }: Props) {
  const facts = def.facts(item).filter((f) => hasValue(f.value));
  const marked = facts.filter((f) => f.key);
  const keyFacts = (marked.length ? marked : facts).slice(0, 4);
  const lists = (def.lists?.(item) ?? []).filter((l) => hasValue(l.items));
  const stats = (def.stats?.(item) ?? []).filter((s) => typeof s.value === 'number');
  const subtitle = def.subtitle(item);
  const rating = def.rating?.(item) ?? null;
  const recs = def.recommendations?.(item) ?? null;

  return (
    <article className={styles.detail}>
      <RememberVisit itemKey={`${def.key}/${item.id}`} />
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <Link href={`/${def.key}`}>{def.label}</Link>
      </nav>

      <header className={styles.header}>
        <span className={styles.kicker}>
          <CategoryIcon cat={def.key} size={15} /> {def.short}
        </span>
        <h1>{item.name}</h1>
        {(subtitle || def.badges) && (
          <p className={styles.sub}>
            {subtitle} <BadgePills badges={def.badges?.(item) ?? []} />
          </p>
        )}
      </header>

      <DetailHero
        cat={def.key}
        name={item.name}
        image={imageFor(def, item)}
        keyFacts={keyFacts}
        stats={stats}
        rating={rating}
      />

      <div className={styles.body}>
        {actions}
        {item.description && (
          <DetailSection title="About">
            <p className={styles.lead}>{item.description}</p>
          </DetailSection>
        )}
        {rating && (rating.pros?.length || rating.cons?.length) ? (
          <DetailSection title="Pros & Cons">
            <ProsCons pros={rating.pros ?? []} cons={rating.cons ?? []} />
          </DetailSection>
        ) : null}
        {recs && (
          <DetailSection title={recs.title}>
            <Recommendations block={recs} />
          </DetailSection>
        )}
        {def.codes && <CheatCodes codes={def.codes(item)} />}
        {extra}
        {facts.length > keyFacts.length && (
          <DetailSection title="Details">
            <FactsTable facts={facts} />
          </DetailSection>
        )}
        {lists.map((l) => (
          <DetailSection key={l.title} title={l.title}>
            <ul className={styles.list}>
              {l.items!.map((x) => (
                <li key={x}>{l.link ? <Linked text={x} /> : x}</li>
              ))}
            </ul>
          </DetailSection>
        ))}
        {hasValue(item.tags) && (
          <DetailSection title="Related searches">
            <div className={styles.tags}>
              {item.tags!.map((t) => (
                <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}>
                  {t}
                </Link>
              ))}
            </div>
          </DetailSection>
        )}
      </div>
    </article>
  );
}
