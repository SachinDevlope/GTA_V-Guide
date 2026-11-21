import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchResults } from '@/features/search/components/SearchResults';

export const metadata: Metadata = { title: 'Search' };

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
