'use client';

import { CalendarClock, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { formatCountdown, nextDailyReset, nextWeeklyReset, type ResetSchedule } from '../lib/resets';
import styles from './ResetCountdown.module.css';

const fmtLocal = (d: Date) =>
  d.toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

/**
 * Live countdowns to the next daily and weekly reset. When a reset passes, the page
 * re-fetches its data (router.refresh) so the "this week" section updates on its own.
 */
export function ResetCountdown({ schedule }: { schedule: ResetSchedule }) {
  const router = useRouter();
  const [now, setNow] = useState<Date | null>(null);
  const lastWeekly = useRef<number | null>(null);
  const lastDaily = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!now) return;
    const w = nextWeeklyReset(now, schedule).getTime();
    const d = nextDailyReset(now, schedule).getTime();
    const changed = (lastWeekly.current != null && lastWeekly.current !== w) || (lastDaily.current != null && lastDaily.current !== d);
    lastWeekly.current = w;
    lastDaily.current = d;
    if (changed) router.refresh();
  }, [now, schedule, router]);

  const daily = now ? nextDailyReset(now, schedule) : null;
  const weekly = now ? nextWeeklyReset(now, schedule) : null;

  return (
    <div className={styles.grid}>
      <div className={styles.box}>
        <span className={styles.label}>
          <Sun size={15} aria-hidden="true" /> Daily challenges reset in
        </span>
        <strong className={styles.time} suppressHydrationWarning>
          {daily && now ? formatCountdown(daily.getTime() - now.getTime()) : '—'}
        </strong>
        <span className={styles.when} suppressHydrationWarning>
          {daily ? `${fmtLocal(daily)} your time · every day ${String(schedule.dailyUtcHour).padStart(2, '0')}:00 UTC` : ''}
        </span>
      </div>
      <div className={styles.box}>
        <span className={styles.label}>
          <CalendarClock size={15} aria-hidden="true" /> Weekly challenge &amp; event reset in
        </span>
        <strong className={styles.time} suppressHydrationWarning>
          {weekly && now ? formatCountdown(weekly.getTime() - now.getTime()) : '—'}
        </strong>
        <span className={styles.when} suppressHydrationWarning>
          {weekly ? `${fmtLocal(weekly)} your time · Thursdays ${String(schedule.weeklyUtcHour).padStart(2, '0')}:00 UTC` : ''}
        </span>
      </div>
    </div>
  );
}
