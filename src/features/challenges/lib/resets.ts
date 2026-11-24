/** When GTA Online's daily and weekly challenges reset (UTC). */
export interface ResetSchedule {
  dailyUtcHour: number;
  weeklyUtcDay: number; // 0 = Sunday … 4 = Thursday
  weeklyUtcHour: number;
}

const DAY = 24 * 60 * 60 * 1000;

/** Next daily reset strictly after `now`. */
export function nextDailyReset(now: Date, s: ResetSchedule): Date {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), s.dailyUtcHour));
  return d.getTime() > now.getTime() ? d : new Date(d.getTime() + DAY);
}

/** Next weekly reset strictly after `now`. */
export function nextWeeklyReset(now: Date, s: ResetSchedule): Date {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), s.weeklyUtcHour));
  const ahead = (s.weeklyUtcDay - now.getUTCDay() + 7) % 7;
  const d = new Date(today.getTime() + ahead * DAY);
  return d.getTime() > now.getTime() ? d : new Date(d.getTime() + 7 * DAY);
}

/** The weekly reset that started the current week. */
export function currentWeekStart(now: Date, s: ResetSchedule): Date {
  return new Date(nextWeeklyReset(now, s).getTime() - 7 * DAY);
}

/** "2d 4h 12m 05s" style countdown. */
export function formatCountdown(ms: number): string {
  const t = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(t / 86400);
  const h = Math.floor((t % 86400) / 3600);
  const m = Math.floor((t % 3600) / 60);
  const sec = t % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return d ? `${d}d ${h}h ${pad(m)}m` : `${h}h ${pad(m)}m ${pad(sec)}s`;
}
