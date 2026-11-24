import { Flame, Info } from 'lucide-react';
import { money } from '@/shared/lib/format';
import type { ChallengeData } from '../lib/challenges';
import styles from './ChallengeInfo.module.css';

/** Rewards, streaks and the pool of possible daily challenges, grouped by category. */
export function ChallengeInfo({ data }: { data: ChallengeData }) {
  const groups = new Map<string, string[]>();
  for (const c of data.dailyPool) groups.set(c.category, [...(groups.get(c.category) ?? []), c.text]);

  return (
    <div className={styles.wrap}>
      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.label}>Daily challenges</span>
          <strong className={styles.big}>
            {data.daily.count ?? 3} a day
            {data.daily.rewardForAllThree != null ? (
              <small> · {money(data.daily.rewardForAllThree)} for all three</small>
            ) : (
              data.daily.rewardEach != null && <small> · {money(data.daily.rewardEach)} each</small>
            )}
          </strong>
          {data.daily.rewardText && <p>{data.daily.rewardText}</p>}
          {data.daily.howTo && <p className={styles.muted}>{data.daily.howTo}</p>}
        </div>
        <div className={styles.card}>
          <span className={styles.label}>Weekly challenge</span>
          <strong className={styles.big}>{data.weekly.reward != null ? money(data.weekly.reward) : '1 a week'}</strong>
          {data.weekly.rewardText && <p>{data.weekly.rewardText}</p>}
          {data.weekly.howTo && <p className={styles.muted}>{data.weekly.howTo}</p>}
        </div>
      </div>

      {data.daily.streaks.length > 0 && (
        <ul className={styles.streaks}>
          {data.daily.streaks.map((s) => (
            <li key={s.name}>
              <Flame size={15} aria-hidden="true" />
              <span>
                <strong>
                  {s.name}
                  {s.reward != null && (
                    <em>
                      {money(s.reward)}
                      {s.rp != null && ` + ${s.rp.toLocaleString('en-US')} RP`}
                    </em>
                  )}
                </strong>
                {s.text && <span>{s.text}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}

      {groups.size > 0 && (
        <>
          <h3 className={styles.sub}>Possible daily challenges ({data.dailyPool.length})</h3>
          <div className={styles.pool}>
            {[...groups].map(([cat, items]) => (
              <details key={cat} className={styles.group}>
                <summary>
                  {cat} <span>{items.length}</span>
                </summary>
                <ul>
                  {items.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </>
      )}

      {data.weeklyExamples.length > 0 && (
        <>
          <h3 className={styles.sub}>Recent weekly challenges</h3>
          <ul className={styles.examples}>
            {data.weeklyExamples.map((w) => (
              <li key={w.text}>
                <span>
                  {w.text}
                  {w.week && <small>{w.week.replace(/-/g, '‑')}</small>}
                </span>
                {w.reward && <em>{w.reward}</em>}
              </li>
            ))}
          </ul>
        </>
      )}

      {[data.resets.note, data.daily.note, data.weekly.note].some(Boolean) && (
        <div className={styles.note}>
          <Info size={15} aria-hidden="true" />
          <p>{[data.resets.note, data.daily.note, data.weekly.note].filter(Boolean).join(' ')}</p>
        </div>
      )}
    </div>
  );
}
