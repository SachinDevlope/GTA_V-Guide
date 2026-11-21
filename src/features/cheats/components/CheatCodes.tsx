import { CopyButton } from '@/shared/components/CopyButton';
import type { CodeLine } from '@/features/catalog/types';
import styles from './CheatCodes.module.css';

/** One row per platform with a copy button. */
export function CheatCodes({ codes }: { codes: CodeLine[] }) {
  const rows = codes.filter((c): c is { platform: string; code: string } => Boolean(c.code));
  if (!rows.length) return null;
  return (
    <section>
      <h2 className={styles.title}>Cheat codes</h2>
      {rows.map((c) => (
        <div key={c.platform} className={styles.row}>
          <span className={styles.platform}>{c.platform}</span>
          <code>{c.code}</code>
          <CopyButton text={c.code} />
        </div>
      ))}
    </section>
  );
}
