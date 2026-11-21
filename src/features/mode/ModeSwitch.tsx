'use client';

import type { ModeFilter } from '@/shared/types';
import { useMode } from './ModeProvider';
import styles from './ModeSwitch.module.css';

const OPTIONS: [ModeFilter, string][] = [
  ['all', 'All'],
  ['Story', 'Story'],
  ['Online', 'Online'],
];

/** Segmented control: show Story mode, GTA Online, or both. */
export function ModeSwitch() {
  const { mode, setMode } = useMode();
  return (
    <div className={styles.seg} role="radiogroup" aria-label="Game mode">
      {OPTIONS.map(([value, label]) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={mode === value}
          className={styles.opt}
          onClick={() => setMode(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
