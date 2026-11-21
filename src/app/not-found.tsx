import Link from 'next/link';
import { EmptyState } from '@/shared/components/EmptyState';

export default function NotFound() {
  return (
    <EmptyState title="Page not found.">
      <p>
        Try the search box above, or go back to the <Link href="/">home page</Link>.
      </p>
    </EmptyState>
  );
}
