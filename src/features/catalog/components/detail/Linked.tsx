import Link from 'next/link';
import { findByName } from '../../lib/cards';

/** Turns a plain name (or "A / B") into links to matching items where they exist. Server component. */
export function Linked({ text }: { text: string }) {
  const parts = text.split(/\s*\/\s*/);
  return (
    <>
      {parts.map((p, i) => {
        const target = findByName(p);
        return (
          <span key={i}>
            {i > 0 && ' / '}
            {target ? <Link href={target.href}>{p}</Link> : p}
          </span>
        );
      })}
    </>
  );
}
