import type { Metadata } from 'next';
import { CalendarClock } from 'lucide-react';
import { ChallengesTabs } from '@/features/challenges/components/ChallengesTabs';
import { getChallengeData } from '@/features/challenges/lib/challenges';
import { getWeeklyEvent } from '@/features/challenges/lib/weekly';
import styles from '../best/page.module.css';

export const metadata: Metadata = {
  title: 'Daily & weekly challenges',
  description: 'GTA Online daily and weekly challenges: reset countdowns, this week’s Weekly Challenge and event, rewards, streaks and every daily challenge.',
};

export default async function ChallengesPage() {
  const data = getChallengeData();
  const event = await getWeeklyEvent();
  const schedule = { dailyUtcHour: data.resets.dailyUtcHour, weeklyUtcDay: data.resets.weeklyUtcDay, weeklyUtcHour: data.resets.weeklyUtcHour };
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <span className={styles.icon}>
          <CalendarClock size={22} aria-hidden="true" />
        </span>
        <div>
          <h1>Daily &amp; weekly challenges</h1>
          <p>Pick Daily or Weekly to see its challenges and rewards. The timers count down to the next reset.</p>
        </div>
      </header>
      <section className={styles.section}>
        <ChallengesTabs schedule={schedule} data={data} event={event} />
      </section>
    </div>
  );
}
