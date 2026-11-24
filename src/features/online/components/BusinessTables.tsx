import type { BusinessTable } from '../types';
import styles from './BusinessTables.module.css';

/** Business-specific mechanics as compact tables that fit the width (no scrolling). */
export function BusinessTables({ tables }: { tables: BusinessTable[] }) {
  return (
    <div className={styles.wrap}>
      {tables.map((t) => (
        <section key={t.title} className={styles.block}>
          <h3>{t.title}</h3>
          {t.intro && <p className={styles.intro}>{t.intro}</p>}
          <table className={styles.table}>
            <thead>
              <tr>
                {t.columns.map((c) => (
                  <th key={c} scope="col">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.rows.map((r, i) => (
                <tr key={i} className={i === t.highlightRow ? styles.best : undefined}>
                  {r.map((cell, j) =>
                    j === 0 ? (
                      <th key={j} scope="row" data-label={t.columns[0]}>
                        {cell}
                      </th>
                    ) : (
                      <td key={j} data-label={t.columns[j]}>
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {t.note && <p className={styles.note}>{t.note}</p>}
        </section>
      ))}
    </div>
  );
}
