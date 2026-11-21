/** The two halves of the game. "all" in filters means both. */
export type GameMode = 'Story' | 'Online';
export type ModeFilter = 'all' | GameMode;

export interface ImageRef {
  src: string;
  /** Page the image comes from, for attribution. */
  page: string | null;
}

export interface ChipData {
  label: string;
  tone?: 'money';
}
