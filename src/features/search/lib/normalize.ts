/** Lowercase, strip accents and punctuation, and unify common spellings (e.g. "Mk II" -> "mk2"). */
export function normalize(s: unknown): string {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\bmk\s*ii\b/g, 'mk2')
    .replace(/[^a-z0-9$]+/g, ' ')
    .trim();
}

export function tokenize(s: string): string[] {
  return normalize(s).split(' ').filter(Boolean);
}

/** Flattens [value, weight] pairs into search fields, skipping empty values. */
export function toSearchFields(pairs: [unknown, number][]): { text: string; weight: number }[] {
  const out: { text: string; weight: number }[] = [];
  for (const [value, weight] of pairs) {
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) {
      if (v === null || v === undefined || v === '' || v === false) continue;
      out.push({ text: String(v), weight });
    }
  }
  return out;
}
