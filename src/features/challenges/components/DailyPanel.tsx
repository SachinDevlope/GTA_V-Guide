import { Flame, Info } from 'lucide-react';
import { money } from '@/shared/lib/format';
import type { ChallengeData } from '../lib/challenges';
import styles from './ChallengePanels.module.css';

/** Daily tab: how dailies work, the reward, streak bonuses and every daily challenge you can get. */
export function DailyPanel({ data }: { data: ChallengeData }) {
  const groups = new Map<string, string[]>();
  for (const c of data.dailyPool) groups.set(c.category, [...(groups.get(c.category) ?? []), c.text]);
  const d = data.daily;

  return (
    <div className={styles.wrap}>
      <div className={styles.hero}>
        <div>
          <span className={styles.kicker}>Every day</span>
          <h3>Finish {d.count ?? 3} daily challenges</h3>
          <p>
            Your three challenges are personal: Rockstar picks them for each player and character, so there is no single list for everyone. See yours in
            game under <strong>Interaction Menu &gt; Challenges &gt; Daily Challenges</strong>.
          </p>
        </div>
        <div className={styles.reward}>
          <span>Reward for all three</span>
          <strong>{d.rewardForAllThree != null ? money(d.rewardForAllThree) : d.rewardEach != null ? `${money(d.rewardEach)} each` : '—'}</strong>
          {d.rpForAllThree != null && <small>+ {d.rpForAllThree.toLocaleString('en-US')} RP</small>}
        </div>
      </div>

      {d.streaks.length > 0 && (
        <>
          <h4 className={styles.sub}>Streak bonuses</h4>
          <ul className={styles.streaks}>
            {d.streaks.map((s) => (
              <li key={s.name}>
                <Flame size={15} aria-hidden="true" />
                <span>
                  <strong>{s.name}</strong>
                  <em>
                    {money(s.reward) ?? '—'}
                    {s.rp != null && ` + ${s.rp.toLocaleString('en-US')} RP`}
                  </em>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      {groups.size > 0 && (
        <>
          <h4 className={styles.sub}>Daily challenges you can get ({data.dailyPool.length}). Tap a group to open it.</h4>
          <div className={styles.pool}>
            {[...groups].map(([cat, items]) => (
              <details key={cat} className={styles.group}>
                <summary>
                  <span>{cat}</span>
                  <em>{items.length}</em>
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

      {(data.resets.note || d.note) && (
        <div className={styles.note}>
          <Info size={15} aria-hidden="true" />
          <p>{[data.resets.note, d.note].filter(Boolean).join(' ')}</p>
        </div>
      )}
    </div>
  );
}
