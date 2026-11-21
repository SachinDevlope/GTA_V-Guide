'use client';

import { House, Trophy } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ModeSwitch } from '@/features/mode/ModeSwitch';
import { useMode } from '@/features/mode/ModeProvider';
import { useSearchIndex } from '@/features/search/SearchIndexProvider';
import type { CategoryKey } from '../types';
import { CategoryIcon } from './CategoryIcon';
import styles from './CategoryNav.module.css';

interface NavItem {
  href: string;
  label: string;
  icon: CategoryKey | 'map' | 'home' | 'best';
  count?: number;
}

/** Sidebar on desktop, a single scrollable row on small screens. */
export function CategoryNav({ mapCount }: { mapCount: number }) {
  const pathname = usePathname();
  const { mode } = useMode();
  const { counts, categories } = useSearchIndex();
  const current = counts[mode];

  const story = categories.filter((m) => ['missions', 'cheats', 'skills'].includes(m.key));
  const online = categories.filter((m) => ['heists', 'online-missions', 'businesses'].includes(m.key));
  const everywhere = categories.filter((m) => !story.includes(m) && !online.includes(m));

  const toItems = (list: typeof categories): NavItem[] =>
    list.filter((m) => current[m.key]).map((m) => ({ href: `/${m.key}`, label: m.short, icon: m.key, count: current[m.key] }));

  const groups: { title: string; items: NavItem[] }[] = [
    {
      title: '',
      items: [
        { href: '/', label: 'Home', icon: 'home' as const },
        { href: '/best', label: 'Best of', icon: 'best' as const },
      ],
    },
    {
      title: 'Story mode',
      items: [...toItems(story), ...(mode !== 'Online' ? [{ href: '/map', label: 'Mission map', icon: 'map' as const, count: mapCount }] : [])],
    },
    { title: 'GTA Online', items: toItems(online) },
    { title: 'Game world', items: toItems(everywhere) },
  ].filter((g) => g.items.length);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/'));

  return (
    <nav className={styles.nav} aria-label="Sections">
      <div className={styles.mode}>
        <ModeSwitch />
      </div>
      {groups.map((g) => (
        <div key={g.title || 'top'} className={styles.group}>
          {g.title && <div className={styles.groupTitle}>{g.title}</div>}
          {g.items.map((it) => (
            <Link key={it.href} href={it.href} className={styles.item} aria-current={isActive(it.href) ? 'page' : undefined}>
              {it.icon === 'home' ? (
                <House size={18} strokeWidth={1.75} aria-hidden="true" />
              ) : it.icon === 'best' ? (
                <Trophy size={18} strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <CategoryIcon cat={it.icon} size={18} />
              )}
              <span className={styles.label}>{it.label}</span>
              {it.count !== undefined && <span className={styles.count}>{it.count}</span>}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
