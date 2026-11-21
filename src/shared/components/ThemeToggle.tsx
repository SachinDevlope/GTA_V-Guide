'use client';

import styles from './ui.module.css';

export const THEME_STORAGE_KEY = 'lsindex-theme';

/** Inline script for <head>: applies the saved theme before first paint. */
export const themeBootScript = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export function ThemeToggle() {
  return (
    <button
      type="button"
      className={styles.iconBtn}
      aria-label="Toggle light / dark theme"
      title="Toggle theme"
      onClick={() => {
        const root = document.documentElement;
        const dark = root.dataset.theme
          ? root.dataset.theme === 'dark'
          : window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.dataset.theme = dark ? 'light' : 'dark';
        try {
          localStorage.setItem(THEME_STORAGE_KEY, root.dataset.theme);
        } catch {
          /* storage blocked */
        }
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z" />
      </svg>
    </button>
  );
}
