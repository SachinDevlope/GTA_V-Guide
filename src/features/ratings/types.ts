/** Where an item ranks within its group, e.g. #3 of 30 Super vehicles. */
export interface RankInfo {
  position: number;
  total: number;
  /** e.g. "Super vehicles by lap time" */
  label: string;
}

/** A 1–5 star score, what it is based on, and why. */
export interface Rating {
  stars: number;
  basis: string;
  rank?: RankInfo;
  pros?: string[];
  cons?: string[];
}
