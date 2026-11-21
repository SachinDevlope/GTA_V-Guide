'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { SearchBar } from './SearchBar';

/** The header search box. Hidden on the home page, which has its own big search box. */
export function HeaderSearch() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  return (
    <Suspense>
      <SearchBar size="compact" />
    </Suspense>
  );
}
