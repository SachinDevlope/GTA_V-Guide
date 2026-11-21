import { Fragment, type ReactNode } from 'react';
import { tokenize } from './normalize';

/** Wraps parts of `text` that match the query words in <mark>. */
export function highlight(text: string, query: string | undefined): ReactNode {
  if (!query) return text;
  const tokens = tokenize(query).filter((t) => t.length > 1);
  if (!tokens.length) return text;
  const re = new RegExp('(' + tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
  const parts = text.split(re);
  return parts.map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>));
}
