import type { Metadata } from 'next';
import { CalendarClock } from 'lucide-react';
import { ChallengeInfo } from '@/features/challenges/components/ChallengeInfo';
import { ResetCountdown } from '@/features/challenges/components/ResetCountdown';
import { WeeklyEventCard } from '@/features/challenges/components/WeeklyEventCard';
import { getChallengeData } from '@/features/challenges/lib/challenges';
import { getWeeklyEvent } from '@/features/challenges/lib/weekly';
import styles from '../best/page.module.css';

export const metadata: Metadata = {
  title: 'Daily & weekly challenges',
  description: 'GTA Online daily and weekly challenge reset timers, this week’s event, rewards and the list of possible daily challenges.',
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
          <p>Live countdowns to the next reset, this week&rsquo;s event and Weekly Challenge, the rewards, and every daily challenge you can get.</p>
        </div>
      </header>
      <section className={styles.section}>
        <ResetCountdown schedule={schedule} />
      </section>
      {event && (
        <section className={styles.section}>
          <h2>This week</h2>
          <WeeklyEventCard event={event} schedule={schedule} />
        </section>
      )}
      <section className={styles.section}>
        <h2>Rewards &amp; possible challenges</h2>
        <ChallengeInfo data={data} />
      </section>
    </div>
  );
}
