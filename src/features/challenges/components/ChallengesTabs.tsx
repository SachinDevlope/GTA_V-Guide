'use client';

import { CalendarClock, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { ChallengeData } from '../lib/challenges';
import { formatCountdown, nextDailyReset, nextWeeklyReset, type ResetSchedule } from '../lib/resets';
import type { WeeklyEvent } from '../lib/weekly';
import styles from './ChallengesTabs.module.css';
import { DailyPanel } from './DailyPanel';
import { WeeklyPanel } from './WeeklyPanel';

type Tab = 'daily' | 'weekly';

const fmtLocal = (d: Date) => d.toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

interface Props {
  schedule: ResetSchedule;
  data: ChallengeData;
  event: WeeklyEvent | null;
}

/**
 * Two clickable tabs, Daily and Weekly, each with its live reset countdown. The chosen tab's
 * challenges show below. When a reset passes, the page re-fetches its data (router.refresh).
 */
export function ChallengesTabs({ schedule, data, event }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('daily');
  const [now, setNow] = useState<Date | null>(null);
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (window.location.hash === '#weekly') setTab('weekly');
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!now) return;
    const key = `${nextDailyReset(now, schedule).getTime()}-${nextWeeklyReset(now, schedule).getTime()}`;
    if (last.current && last.current !== key) router.refresh();
    last.current = key;
  }, [now, schedule, router]);

  const choose = (t: Tab) => {
    setTab(t);
    try {
      window.history.replaceState(null, '', `#${t}`);
    } catch {}
  };

  const daily = now ? nextDailyReset(now, schedule) : null;
  const weekly = now ? nextWeeklyReset(now, schedule) : null;
  const tabs: { key: Tab; label: string; icon: React.ReactNode; next: Date | null; every: string }[] = [
    { key: 'daily', label: 'Daily challenges', icon: <Sun size={16} aria-hidden="true" />, next: daily, every: `every day ${String(schedule.dailyUtcHour).padStart(2, '0')}:00 UTC` },
    { key: 'weekly', label: 'Weekly challenge', icon: <CalendarClock size={16} aria-hidden="true" />, next: weekly, every: `Thursdays ${String(schedule.weeklyUtcHour).padStart(2, '0')}:00 UTC` },
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs} role="tablist" aria-label="Challenge type">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`tab-${t.key}`}
            aria-selected={tab === t.key}
            aria-controls={`panel-${t.key}`}
            className={styles.tab}
            onClick={() => choose(t.key)}
          >
            <span className={styles.label}>
              {t.icon} {t.label}
            </span>
            <span className={styles.resets}>Resets in</span>
            <strong className={styles.time} suppressHydrationWarning>
              {t.next && now ? formatCountdown(t.next.getTime() - now.getTime()) : '—'}
            </strong>
            <span className={styles.when} suppressHydrationWarning>
              {t.next ? `${fmtLocal(t.next)} your time · ${t.every}` : t.every}
            </span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className={styles.panel}>
        {tab === 'daily' ? <DailyPanel data={data} /> : <WeeklyPanel data={data} event={event} schedule={schedule} />}
      </div>
    </div>
  );
}
