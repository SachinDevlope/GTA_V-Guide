'use client';

import { useEffect } from 'react';
import { rememberRecent } from '../hooks/useRecentSearches';

/** Drop into a detail page so it shows up under "Recent" in the search box. */
export function RememberVisit({ itemKey }: { itemKey: string }) {
  useEffect(() => rememberRecent({ key: itemKey }), [itemKey]);
  return null;
}
