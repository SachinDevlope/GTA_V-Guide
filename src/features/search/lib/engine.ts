import { normalize, tokenize } from './normalize';
import type { Searchable } from './types';

interface PreparedField {
  n: string;
  words: string[];
  compact: string;
  w: number;
}

export interface Prepared<T> {
  item: T;
  fields: PreparedField[];
}

export interface Hit<T> {
  item: T;
  score: number;
}

const NAME_WEIGHT = 10;

/**
 * Words people add to questions ("best attachments for heavy sniper") that should not
 * block a result when nothing contains them.
 */
const SOFT_WORDS = new Set([
  'best', 'top', 'good', 'upgrade', 'upgrades', 'attachment', 'attachments', 'mods', 'mod', 'loadout', 'build',
  'how', 'to', 'get', 'the', 'a', 'an', 'of', 'in', 'for', 'is', 'what', 'which', 'gta', 'v', '5',
]);

function prepField(text: string, w: number): PreparedField {
  const n = normalize(text);
  return { n, words: n.split(' '), compact: n.replace(/ /g, ''), w };
}

/** Precomputes normalized text for fast repeated searching. */
export function prepare<T extends Searchable>(items: T[]): Prepared<T>[] {
  return items.map((item) => ({
    item,
    fields: [
      prepField(item.name, NAME_WEIGHT),
      ...item.search.filter((f) => f.text !== item.name).map((f) => prepField(f.text, f.weight)),
      ...(item.description ? [prepField(item.description, 1)] : []),
    ],
  }));
}

/** Edit distance with early exit once it exceeds `max`. */
function levenshtein(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (cur[j] < best) best = cur[j];
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

function scoreOne(fields: PreparedField[], tokens: string[], joined: string, qCompact: string): number {
  let total = 0;
  for (const t of tokens) {
    let best = 0;
    const maxEdits = t.length >= 7 ? 2 : t.length >= 4 ? 1 : 0;
    for (const f of fields) {
      let s = 0;
      if (f.n === t) s = f.w * 4;
      else if (f.words.includes(t)) s = f.w * 3;
      else if (f.words.some((w) => w.startsWith(t))) s = f.w * 2;
      else if (f.n.includes(t) || f.compact.includes(t)) s = f.w * 1.2;
      else if (maxEdits && f.w >= 3) {
        // Typo tolerance only on the more important fields.
        for (const w of f.words) {
          if (w.length >= 3 && levenshtein(t, w, maxEdits) <= maxEdits) {
            s = f.w * 0.7;
            break;
          }
        }
      }
      if (s > best) best = s;
    }
    if (!best) {
      if (SOFT_WORDS.has(t)) continue; // filler word: ignore
      return 0; // every real word of the query must match something
    }
    total += best;
  }
  const name = fields[0];
  if (name.n === joined || name.compact === qCompact) total += 60;
  else if (name.compact.startsWith(qCompact)) total += 25;
  return total;
}

/** Ranks items for a free-text query. Empty query returns everything with score 0. */
export function searchPrepared<T>(prepared: Prepared<T>[], query: string): Hit<T>[] {
  const tokens = tokenize(query);
  if (!tokens.length) return prepared.map((p) => ({ item: p.item, score: 0 }));
  const joined = tokens.join(' ');
  const qCompact = joined.replace(/ /g, '');
  const hits: Hit<T>[] = [];
  for (const p of prepared) {
    const score = scoreOne(p.fields, tokens, joined, qCompact);
    if (score > 0) hits.push({ item: p.item, score });
  }
  return hits.sort((a, b) => b.score - a.score);
}

/** Score that means "the query is essentially this item's name". */
export const EXACT_NAME_SCORE = 60;
