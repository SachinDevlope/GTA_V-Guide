import raw from '@/data/weekly-event.json';

/** The current weekly GTA Online event (serializable). */
export interface WeeklyEvent {
  title: string;
  subtitle: string | null;
  published: string; // YYYY-MM-DD
  url: string;
  summary: string | null;
  weeklyChallenge: string | null;
  bonuses: string[];
}

/** The weekly event data source. Currently the bundled JSON file; swap this for a live source later. */
export async function getWeeklyEvent(): Promise<WeeklyEvent | null> {
  const e = raw as unknown as Partial<WeeklyEvent>;
  if (!e.title || !e.url || !e.published) return null;
  return {
    title: e.title,
    subtitle: e.subtitle ?? null,
    published: e.published,
    url: e.url,
    summary: e.summary ?? null,
    weeklyChallenge: e.weeklyChallenge ?? null,
    bonuses: e.bonuses ?? [],
  };
}
