'use client';

import { AlertTriangle, ExternalLink, Info, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ChallengeData } from '../lib/challenges';
import { currentWeekStart, type ResetSchedule } from '../lib/resets';
import type { WeeklyEvent } from '../lib/weekly';
import styles from './ChallengePanels.module.css';

const day = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

/** Weekly tab: this week's challenge and event, then recent weekly challenges. */
export function WeeklyPanel({ data, event, schedule }: { data: ChallengeData; event: WeeklyEvent | null; schedule: ResetSchedule }) {
  const [stale, setStale] = useState(false);
  useEffect(() => {
    if (!event) return;
    const check = () => setStale(new Date(`${event.weekStart}T23:59:59Z`).getTime() < currentWeekStart(new Date(), schedule).getTime() - 1);
    check();
    const id = window.setInterval(check, 60_000);
    return () => window.clearInterval(id);
  }, [event, schedule]);

  const w = data.weekly;
  return (
    <div className={styles.wrap}>
      {event && stale && (
        <p className={styles.stale}>
          <AlertTriangle size={15} aria-hidden="true" />
          This is last week&rsquo;s info ({day(event.weekStart)} – {day(event.weekEnd)}). The new week&rsquo;s challenge will be added soon.
        </p>
      )}

      <div className={styles.hero}>
        <div>
          <span className={styles.kicker}>{event ? `This week · ${day(event.weekStart)} – ${day(event.weekEnd)}` : 'This week'}</span>
          <h3>
            <Target size={18} aria-hidden="true" /> {event?.weeklyChallenge?.text ?? 'Weekly Challenge not announced yet'}
          </h3>
          <p>
            One challenge a week, the same for everyone. Track it in game under <strong>Interaction Menu &gt; Challenges &gt; Weekly Challenge</strong>.
          </p>
          {event?.weeklyChallenge?.note && <p className={styles.small}>{event.weeklyChallenge.note}</p>}
        </div>
        <div className={styles.reward}>
          <span>Reward</span>
          <strong>{event?.weeklyChallenge?.reward ?? (w.reward != null ? `GTA$${w.reward.toLocaleString('en-US')}` : '—')}</strong>
          {w.rp != null && <small>+ {w.rp.toLocaleString('en-US')} RP (usual)</small>}
        </div>
      </div>

      {event && (
        <>
          <h4 className={styles.sub}>{event.title}</h4>
          {event.summary && <p className={styles.small}>{event.summary}</p>}
          <div className={styles.sections}>
            {event.sections.map((s) => (
              <section key={s.title} className={styles.box}>
                <h5>{s.title}</h5>
                <ul>
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          {event.sources.length > 0 && (
            <p className={styles.sources}>
              Sources:{' '}
              {event.sources.map((s, i) => (
                <span key={s.url}>
                  {i > 0 && ', '}
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.name} <ExternalLink size={12} aria-hidden="true" />
                  </a>
                </span>
              ))}
            </p>
          )}
        </>
      )}

      {data.weeklyExamples.length > 0 && (
        <>
          <h4 className={styles.sub}>Earlier weekly challenges</h4>
          <ul className={styles.history}>
            {data.weeklyExamples.map((x) => (
              <li key={x.text}>
                <span>
                  {x.text}
                  {x.week && <small>{x.week}</small>}
                </span>
                {x.reward && <em>{x.reward}</em>}
              </li>
            ))}
          </ul>
        </>
      )}

      {w.note && (
        <div className={styles.note}>
          <Info size={15} aria-hidden="true" />
          <p>{w.note}</p>
        </div>
      )}
    </div>
  );
}
