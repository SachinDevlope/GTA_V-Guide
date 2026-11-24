import raw from '@/data/challenges.json';
import type { ResetSchedule } from './resets';

export interface ChallengeData {
  resets: ResetSchedule & { daily: string; weekly: string; note: string | null };
  daily: {
    count: number | null;
    rewardEach: number | null;
    rewardForAllThree?: number | null;
    rpForAllThree?: number | null;
    rewardText: string | null;
    streaks: { name: string; reward: number | null; rp?: number | null; text: string | null }[];
    howTo: string | null;
    note: string | null;
  };
  weekly: { reward: number | null; rp?: number | null; rewardText: string | null; howTo: string | null; note: string | null };
  dailyPool: { text: string; category: string }[];
  weeklyExamples: { text: string; reward: string | null; week?: string | null }[];
  sources: string[];
}

const DEFAULT_SCHEDULE: ResetSchedule = { dailyUtcHour: 6, weeklyUtcDay: 4, weeklyUtcHour: 10 };

export function getChallengeData(): ChallengeData {
  const d = raw as unknown as Partial<ChallengeData>;
  return {
    resets: { daily: '06:00 UTC every day', weekly: 'Thursday 10:00 UTC', note: null, ...DEFAULT_SCHEDULE, ...(d.resets ?? {}) },
    daily: { count: 3, rewardEach: null, rewardText: null, streaks: [], howTo: null, note: null, ...(d.daily ?? {}) },
    weekly: { reward: null, rewardText: null, howTo: null, note: null, ...(d.weekly ?? {}) },
    dailyPool: d.dailyPool ?? [],
    weeklyExamples: d.weeklyExamples ?? [],
    sources: d.sources ?? [],
  };
}
