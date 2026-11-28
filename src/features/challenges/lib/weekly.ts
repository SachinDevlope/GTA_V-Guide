import raw from '@/data/weekly-event.json';

/** This week's GTA Online event (serializable). */
export interface WeeklyEvent {
  weekStart: string; // YYYY-MM-DD (Thursday)
  weekEnd: string; // YYYY-MM-DD (Wednesday)
  title: string;
  summary: string | null;
  weeklyChallenge: { text: string; reward: string | null; note: string | null } | null;
  sections: { title: string; items: string[] }[];
  sources: { name: string; url: string }[];
}

/** The weekly event data source: the bundled JSON file, updated after each Thursday reset. */
export async function getWeeklyEvent(): Promise<WeeklyEvent | null> {
  const e = raw as unknown as Partial<WeeklyEvent>;
  if (!e.title || !e.weekStart || !e.weekEnd) return null;
  return {
    weekStart: e.weekStart,
    weekEnd: e.weekEnd,
    title: e.title,
    summary: e.summary ?? null,
    weeklyChallenge: e.weeklyChallenge ?? null,
    sections: e.sections ?? [],
    sources: e.sources ?? [],
  };
}
