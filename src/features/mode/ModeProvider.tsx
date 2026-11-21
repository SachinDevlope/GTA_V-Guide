'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ModeFilter } from '@/shared/types';

const STORAGE_KEY = 'lsindex-mode';

interface ModeContextValue {
  mode: ModeFilter;
  setMode: (m: ModeFilter) => void;
}

const ModeContext = createContext<ModeContextValue>({ mode: 'all', setMode: () => {} });

/** Remembers whether the viewer wants Story mode, GTA Online, or both. */
export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ModeFilter>('all');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'Story' || saved === 'Online' || saved === 'all') setModeState(saved);
    } catch {
      /* storage blocked */
    }
  }, []);

  const setMode = useCallback((m: ModeFilter) => {
    setModeState(m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {
      /* storage blocked */
    }
  }, []);

  return <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>;
}

export const useMode = () => useContext(ModeContext);
