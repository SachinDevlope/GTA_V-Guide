'use client';

import { AlertTriangle, ExternalLink, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { currentWeekStart, type ResetSchedule } from '../lib/resets';
import type { WeeklyEvent } from '../lib/weekly';
import styles from './WeeklyEventCard.module.css';

/** This week's event and Weekly Challenge; warns once the data is older than the current week. */
export function WeeklyEventCard({ event, schedule }: { event: WeeklyEvent; schedule: ResetSchedule }) {
  const [stale, setStale] = useState(false);
  useEffect(() => {
    const check = () => setStale(new Date(`${event.published}T23:59:59Z`).getTime() < currentWeekStart(new Date(), schedule).getTime());
    check();
    const id = window.setInterval(check, 60_000);
    return () => window.clearInterval(id);
  }, [event.published, schedule]);

  const date = new Date(`${event.published}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

  return (
    <article className={styles.card}>
      {stale && (
        <p className={styles.stale}>
          <AlertTriangle size={15} aria-hidden="true" />
          This is from an earlier week ({date}). A new week has started; check the Rockstar Newswire for the latest event.
        </p>
      )}
      <span className={styles.date}>Rockstar Newswire · {date}</span>
      <h3>{event.title}</h3>
      {event.subtitle && <p className={styles.subtitle}>{event.subtitle}</p>}
      {event.summary && <p className={styles.summary}>{event.summary}</p>}
      <div className={styles.challenge}>
        <Target size={16} aria-hidden="true" />
        <span>
          <strong>Weekly Challenge</strong>
          <span>{event.weeklyChallenge ?? 'Not listed in this post. Check the in-game Interaction Menu > Challenges.'}</span>
        </span>
      </div>
      {event.bonuses.length > 0 && (
        <ul className={styles.bonuses}>
          {event.bonuses.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      <a href={event.url} target="_blank" rel="noreferrer" className={styles.link}>
        Read the full post <ExternalLink size={13} aria-hidden="true" />
      </a>
    </article>
  );
}
